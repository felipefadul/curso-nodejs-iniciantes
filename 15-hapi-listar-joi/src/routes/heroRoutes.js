const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');

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
          failAction: (request, headers, error) => {
            throw error;
          }
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
}

module.exports = HeroRoutes;