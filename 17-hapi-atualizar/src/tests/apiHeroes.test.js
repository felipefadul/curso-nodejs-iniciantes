const assert = require('assert');
const api = require('../api');
const { stat } = require('fs');

let app = {};

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica'
};

const MOCK_HEROI_INICIAL = {
  nome: 'Gavião Negro',
  poder: 'Mira'
}

let MOCK_ID = '';

describe('Suite de testes da API Heroes', function() {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: JSON.stringify(MOCK_HEROI_INICIAL)
    });

    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
  });

  it('Listar GET /herois', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois?skip=0&limit=10'
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('Listar GET /herois - deve retornar somente 3 registros', async () => {
    const TAMANHO_LIMITE = 3;
    
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });

  it('Listar GET /herois com limit NaN - deve retornar um erro', async () => {
    const TAMANHO_LIMITE = 'AEE';
    
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
    });

    const errorResult = { 
      "statusCode": 400,
       "error": "Bad Request",
        "message": "child \"limit\" fails because [\"limit\" must be a number]",
        "validation": { "source": "query", "keys": ["limit"] 
      } 
    };

    assert.deepEqual(result.statusCode, 400);
    assert.deepEqual(result.payload, JSON.stringify(errorResult));
  });

  it('Listar GET /herois - deve filtrar um item', async () => {
    const NAME = MOCK_HEROI_INICIAL.nome;

    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=1000&nome=${NAME}`
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados[0].nome, NAME);
  });

  it('Cadastrar POST /herois', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/herois`,
      payload: MOCK_HEROI_CADASTRAR
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(message, "Herói cadastrado com sucesso!");
    assert.notStrictEqual(_id, undefined);
  });

  it('Atualizar PATCH /herois/:id', async () => {
    const _id = MOCK_ID;
    const expected = {
      poder: 'Super mira'
    };

    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      payload: expected
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Herói atualizado com sucesso!');
  });

  it('Atualizar PATCH /herois/:id - não deve atualizar com ID incorreto', async () => {
    const _id = `5ee571b9ce6f5838cc31ace8`;
    const expected = {
      poder: 'Super mira'
    };
    
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      payload: expected
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Não foi possível atualizar!');
  });

});