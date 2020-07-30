const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');

const failAction = (request, headers, error) => {
  throw error;
}

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        validate: {
          // Possíveis validações:
          // payload -> body
          // headers -> header
          // params  -> na URL :id
          // query   -> ?skip=10&limit=10
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          },
          failAction
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;

          const query = nome ? {
            // Regex que procura tudo que contém o nome.
            nome: {$regex: `.*${nome}*.`}
          } : {};

          return this.db.read(query, parseInt(skip), parseInt(limit));
        }
        catch(error) {
          console.log('Ocorreu um erro!', error);
          return "Erro interno no servidor!";
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        validate: {
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100)
          },
          failAction
        },
        handler: async (request) => {
          try {
            const { nome, poder } = request.payload;
            const result = await this.db.create({ nome, poder });
            return {
              message: 'Herói cadastrado com sucesso!',
              _id: result._id
            };
          }
          catch(error) {
            console.log('Ocorreu um erro!', error);
            return "Erro interno no servidor!";
          }
        }
      }
    }
  }
}

module.exports = HeroRoutes;