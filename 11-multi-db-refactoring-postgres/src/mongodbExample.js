const Mongoose = require('mongoose');

Mongoose.connect('mongodb://felipefadul:minhasenhasecreta@localhost:27017/herois',
  { useNewUrlParser: true }, function (error) {
    if (!error) return;

    console.log('Falha na conexão!', error)
  });

const connection = Mongoose.connection;

/* 
//Maneiras de declarar funções no JavaScript
function nomeFuncao() {

}

const minhaFuncao = function() {

}

const minhaFuncaoArrow = () => {

}

const minhaFuncaoArrow = (params) => console.log(params);
*/

connection.once('open', () => console.log('Database rodando!'));
// setTimeout(() => {
//   const state = connection.readyState;
//   console.log('state', state);
// }, 1000);
/**
 * Possíveis estados:
 * 0: Desconectado
 * 1: Conectado
 * 2: Conectando
 * 3: Desconectando
 */

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
const model = Mongoose.model('herois', heroiSchema);

async function main() {
  const resultCadastrar = await model.create({
    nome: 'Batman',
    poder: 'Dinheiro'
  });
  console.log('result cadastrar', resultCadastrar);

  const listItens = await model.find();
  console.log('itens', listItens);
}

main();