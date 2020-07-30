// npm i hapi
// npm i vision inert hapi-swagger@9.1.3
// npm i hapi-auth-jwt2
// npm i bcrypt
// npm i dotenv

const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || "dev"; // Por default, é "dev".
ok(env === "prod" || env === "dev", 'A env é inválida! Deve ser "prod" ou "dev"');

const configPath = join(__dirname, './config', `.env.${env}`);
config({
  path: configPath
});

const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongoDbStrategy');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');

const Postgres = require('./db/strategies/postgres/postgresSQLStrategy');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema');

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const HapiJwt = require('hapi-auth-jwt2');

const UtilRouters = require('./routes/utilRoutes');
const UtilRoutes = require('./routes/utilRoutes');

const JWT_SECRET =  process.env.JWT_KEY;

const app = new Hapi.Server({
  port: process.env.PORT
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connectionMongoDb = MongoDb.connect();
  const contextMongoDb = new Context(new MongoDb(connectionMongoDb, HeroiSchema));
  
  const connectionPostgres = await Postgres.connect();
  const usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
  const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioSchema));

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
    validate: async (dado, request) => {
      // Verifica no banco se o usuário existe.
      const [ result ] = await contextPostgres.read({
        username: dado.username.toLowerCase()
      });

      if(!result) {
        return {
          isValid: false
        };
      }

      return {
        isValid: true
      };
    }
  });

  app.auth.default('jwt');
  

  app.route([
    ...mapRoutes(new HeroRoute(contextMongoDb), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
    ...mapRoutes(new UtilRoutes(), UtilRouters.methods())
  ]);

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);

  return app;
}

module.exports = main();