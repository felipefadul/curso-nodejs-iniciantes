const { obterPessoas } = require('./service');

Array.prototype.meuReduce = function (callback, valorInicial) {
  let valorFinal = typeof valorInicial !== 'undefined' ? valorInicial : this[0];
  let index = typeof valorInicial !== 'undefined' ? 0 : 1;
  for(; index <= this.length - 1; index++) {
    valorFinal = callback(valorFinal, this[index], this) 
  }
  return valorFinal;
}

async function main() {
  try {
    const { results } = await obterPessoas('a');
    const alturas = results.map(item => parseInt(item.height));
    console.log('alturas', alturas);
    //O objetivo do Reduce é reduzir a um valor final
    // Exemplo: [20.2, 30.3, 40.5] => 91
    // const total = pesos.reduce((anterior, proximo) => {
    //   return anterior + proximo;
    // }, 0)

    const minhaLista = [
      ['Erick', 'Wendel'],
      ['NodeBR', 'Nerdzão']
    ];

    const total = minhaLista.meuReduce((anterior, proximo) => {
      return anterior.concat(proximo);
    })
    .join(', ');

    console.log('total', total);
  } catch (error) {
    console.error('OCORREU UM ERRO', error);
  }
}

main();