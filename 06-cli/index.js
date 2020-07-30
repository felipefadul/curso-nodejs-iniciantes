const Commander = require('commander');
const Database = require('./database');
const Heroi = require('./heroi');

async function main() {
  Commander
    .version('v1')
    .option('-n, --nome [value]', "Nome do herói")
    .option('-p, --poder [value]', "Poder do herói")
    .option('-i, --id [value]', "Id do herói")
    
    .option('-c, --cadastrar', "Cadastrar um herói")
    .option('-l, --listar', "Listar um heroi")
    .option('-r, --remover [value]', "Remover um heroi pelo id")
    .option('-a, --atualizar [value]', "Atualizar um heroi pelo id")
    .parse(process.argv);

  const heroi = new Heroi(Commander);

  try {
    if (Commander.cadastrar) {
      const dado = JSON.stringify(heroi);
      const heroiCadastrar = JSON.parse(dado); // Remover todas as chaves que estiverem com undefined ou null.

      const resultado = await Database.cadastrar(heroiCadastrar);
      if (!resultado) {
        console.error('Herói não foi cadastrado!');
        return;
      }
      console.log('Herói cadastrado com sucesso!');
    }

    if (Commander.listar) {
      const resultado = await Database.listar();
      console.log(resultado);
      return;
    }

    if (Commander.remover) {
      const resultado = await Database.remover(Commander.remover);
      if (!resultado) {
        console.error('Não foi possível remover o herói!');
        return;
      }
      console.log('Herói removido com sucesso!');
    }

    if (Commander.atualizar) {
      const idParaAtualizar = parseInt(Commander.atualizar);
      const dado = JSON.stringify(heroi);
      const heroiAtualizar = JSON.parse(dado); // Remover todas as chaves que estiverem com undefined ou null.
      const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar);
      if (!resultado) {
        console.error('Não foi possível atualizar o herói!');
        return;
      }
      console.log('Herói atualizado com sucesso!');
    }
  } catch (error) {
    console.error('OCORREU UM ERRO', error);
  }
}

main();