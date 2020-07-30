// npm i jsonwebtoken

const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');
const PasswordHelper = require('../helpers/passwordHelper');

const failAction = (request, headers, error) => {
  throw error;
}

const USER = {
  username: 'teste123',
  password: '123'
};

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obter token.',
        notes: 'Realiza login com user e senha do banco.',
        validate: {
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          },
          failAction
        }
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        const [ usuario ] = await this.db.read({
          username: username.toLowerCase()
        });

        if(!usuario) {
          return Boom.unauthorized('O usuário informado não existe!');
        }

        const match = await PasswordHelper.comparePassword(password, usuario.password);

        if(!match) {
          return Boom.unauthorized('Usuário ou senha inválidos!');
        }
        // if(username.toLowerCase() !== USER.username.toLowerCase() ||
        //    password !== USER.password)
        //   return Boom.unauthorized();

        const token = Jwt.sign({
          username: username,
          id: usuario.id
        }, this.secret);

        return {
          token
        };
      }
    };
  }

}

module.exports = AuthRoutes;