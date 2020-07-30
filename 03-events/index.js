const EventEmitter = require('events');

class MeuEmissor extends EventEmitter {

}

const meuEmissor = new MeuEmissor();
const nomeEvento = 'usuario:click';

meuEmissor.on(nomeEvento, function (click) {
  console.log('um usuario clicou', click);
});

meuEmissor.emit(nomeEvento, 'na barra de rolagem');

// let count = 0;
// setInterval(function () {
//   meuEmissor.emit(nomeEvento, 'no ok ' + (++count) + ' vezes');
// }, 1000);

const stdin = process.openStdin();
stdin.addListener('data', function (value) {
  console.log(`Você digitou: ${value.toString().trim()}`);
});

/*
//Método utilizando Promise não funciona de maneira adequada
//A ideia da Promisse é ser executada uma única vez.
//Já os eventos são para ações contínuas
const stdin = process.openStdin();

function main() {
  return new Promise(function (resolve, reject) {
    stdin.addListener('data', function (value) {
      //console.log(`Você digitou: ${value.toString().trim()}`);
      return resolve(value);
    });
  })
}

main().then(function (resultado) {
  console.log('resultado', resultado.toString());
})*/