const { deepEqual} = require('assert');
const database = require('./database');

const DEFAULT_ITEM_CADASTRAR = { 
  nome: 'Flash',
  poder: 'Speed',
  id: 1
};

const DEFAULT_ITEM_ATUALIZAR = {
  nome: 'Lanterna Verde',
  poder: 'Energia do Anel',
  id: 2
};

describe('Suite de manipulação de Heróis', () => {
  
  before(async () => {
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR);
  });
  after(async () => {
    await database.remover(DEFAULT_ITEM_CADASTRAR.id);
    await database.remover(DEFAULT_ITEM_ATUALIZAR.id);
  });
  it('Deve pesquisar um heroi usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const [ resultado ] = await database.listar(expected.id); //Obtém somente a primeira posição através de Destructuring
    //const posicaoUm = resultado[0];

    deepEqual(resultado, expected);
  });
  
  it('Deve cadastrar um herói usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const resultado = await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    const [ atual ] = await database.listar(DEFAULT_ITEM_CADASTRAR.id);

    deepEqual(atual, expected);
  });

  it('Deve remover um herói por id', async () => {
    const expected = true;
    const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id);

    deepEqual(resultado, expected);
  });

  it('Deve atualizar um heroi pelo id', async () => {
    const expected = {
      ...DEFAULT_ITEM_ATUALIZAR,
      nome: 'Batman',
      poder: 'Dinheiro'
    };

    const novoDado = {
      nome: 'Batman',
      poder: 'Dinheiro'
    }
    await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado);
    const [ resultado ] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id);
    
    deepEqual(resultado, expected);
  });
});