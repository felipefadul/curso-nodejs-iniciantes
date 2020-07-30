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

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH', // Atualização parcial.
      config: {
        validate: {
          params: {
            id: Joi.string().required()
          },
          payload: {
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          },
          failAction
        }
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;

          // Converte o resultado em string.
          const dadosString = JSON.stringify(payload);
          // Converte o resultado de string de volta para objeto retirando parâmetros null ou undefined.
          const dados = JSON.parse(dadosString);

          const result = await this.db.update(id, dados);

          if(result.nModified !== 1)
            return {
              message: 'Não foi possível atualizar!'
            };

          return {
            message: 'Herói atualizado com sucesso!'
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

module.exports = HeroRoutes;