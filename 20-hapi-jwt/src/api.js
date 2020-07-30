// npm i hapi
// npm i vision inert hapi-swagger@9.1.3
// npm i hapi-auth-jwt2

const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const HapiJwt = require('hapi-auth-jwt2');
const JWT_SECRET = 'MEU_SEGREDÃO_123';

const app = new Hapi.Server({
  port: 5000
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroiSchema));
  
  const swaggerOptions = {
    info: {
      title: 'API Heróis - #CursoNodeBR',
      version: 'v1.0'
    },
    lang: 'pt'
  };

  // Registra e faz comunicação dos módulos.
  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20
    // },
    validate: (dado, request) => {
      // Verifica no banco se o usuário continua ativo.

      return {
        isValid: true
      };
    }
  });

  app.auth.default('jwt');
  

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
  ]);

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);

  return app;
}

module.exports = main();