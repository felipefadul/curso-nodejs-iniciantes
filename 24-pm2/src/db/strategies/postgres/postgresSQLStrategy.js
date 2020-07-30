const ICrud = require ('../interfaces/interfaceCrud');

// npm install sequelize
// Instalar também os drives do banco de dados: npm install pg-hstore pg
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    }
    catch (error) {
      console.log('Fail!', error);
      return false;
    }
  }

  static async connect() {
    const connection = new Sequelize(process.env.POSTGRES_URL, {
      logging: false,
      quoteIdentifiers: false,
      //operatorsAliases: false
      ssl: process.env.SSL_DB,
      dialectOptions: {
        ssl: process.env.SSL_DB,
        rejectUnauthorized: false
      }      
    });
    return connection;
  }

  static async defineModel(connection, schema) {
    const model = connection.define(
      schema.name,
      schema.schema,
      schema.options
    );
    
    await model.sync();

    return model;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item = {}) {
    return this._schema.findAll({ where: item, raw: true});
  }

  // Upsert = true cria, caso não exista.
  async update(id, item, upsert = false) {
    const fn = upsert ? 'upsert' : 'update';

    return await this._schema[fn](item, { where: {id}});
  }

  async delete(id) {
    //Se não for passado um id, deleta tudo.
    const query = id ? { id } : {};
    return this._schema.destroy({where: query});
  }
}

module.exports = Postgres;