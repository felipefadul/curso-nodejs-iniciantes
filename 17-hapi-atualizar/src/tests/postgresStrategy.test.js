// npm i --save-dev mocha

const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroiSchema = require('../db/strategies/postgres/schemas/heroiSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flechas'
};

const MOCK_HEROI_ATUALIZAR = {
  nome: 'Batman',
  poder: 'Dinheiro'
};

let context = {};

describe('Postgres Strategy', function() {
  this.timeout(Infinity);
  this.beforeAll(async function() {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);
    context = new Context(new Postgres(connection, model));
    
    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
  });
  it('PostgresSQL Connection', async function () {
    const result = await context.isConnected();

    assert.equal(result, true);
  });

  it('Cadastrar', async function() {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('Listar', async function() {
    const [ result ] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    // Pegar a primeira posição
    // const posicaoZero = result[0];
    // OU
    // const [posicao1, posicao2] = ['esse é o 1', 'esse é o 2'];

    delete result.id;

    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('Atualizar', async function() {
    const [ itemAtualizar ] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Mulher Maravilha'
    };
    /**
     * No JavaScript temos uma técnica chamada rest/spread que é um método
     * usado para mergear objetos ou separá-los.
     * {
     *    nome: 'Batman',
     *    poder: 'Dinheiro'
     * }
     * 
     * {
     *    dataNascimento: '1998-01-01'
     * }
     * 
     * No final:
     * {
     *    nome: 'Batman',
     *    poder: 'Dinheiro',
     *    dataNascimento: '1998-01-01'
     * }
     */

     const [ result ] = await context.update(itemAtualizar.id, novoItem);
     const [ itemAtualizado ] = await context.read({id: itemAtualizar.id});
     
     assert.deepEqual(result, 1);
     assert.deepEqual(itemAtualizado.nome, novoItem.nome);
  });

  it('Remover por id', async function() {
    const [ item ] = await context.read({});
    const result = await context.delete(item.id);

    assert.deepEqual(result, 1);
  });
});

