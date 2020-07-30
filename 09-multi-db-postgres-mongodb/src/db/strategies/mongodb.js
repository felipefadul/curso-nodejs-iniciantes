const ICrud = require ('./interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando'
};

class MongoDB extends ICrud {
  constructor() {
    super(); // Invoca o construtor do ICrud.
    this._herois = null;
    this._driver = null;
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState];
    if (state === 'Conectado') return state;

    if (state !== 'Conectando') return state;
    
    // Se for conectando, espera 1 segundo e tenta novamente.
    await new Promise(resolve => setTimeout(resolve, 1000));  
    return STATUS[this._driver.readyState];
  }

  defineModel() {
    // Modelo de validação, como a coleção será.
    const heroiSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true
      },
      poder: {
        type: String,
        required: true
      },
      insertedAt: {
        type: Date,
        default: new Date()
      }
    })

    // Registrando o modelo
    this._herois = Mongoose.model('herois', heroiSchema);
  }

  connect() {
    Mongoose.connect('mongodb://felipefadul:minhasenhasecreta@localhost:27017/herois',
      { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
        if (!error) return;
  
        console.log('Falha na conexão!', error)
      });
  
    const connection = Mongoose.connection;
    this._driver = connection;
    
    connection.once('open', () => console.log('Database rodando!'));
    this.defineModel();

  }

  create(item) {
    return this._herois.create(item);
  }

  // Retorna até um limite de valores definido por limit, após pular as primeiras ocorrências definido pelo skip.
  read(item, skip = 0, limit = 10) {
    return this._herois.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._herois.updateOne({ _id: id}, {$set: item});
  }

  delete(id) {
    return this._herois.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;