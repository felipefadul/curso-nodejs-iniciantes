const assert = require('assert');
const api = require('../api');

let app = {};

const MOCK_HEROI_INICIAL = {
  nome: 'Gavião Negro',
  poder: 'Mira'
}

describe('Suite de testes da API Heroes', function() {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: JSON.stringify(MOCK_HEROI_INICIAL)
    });

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
});