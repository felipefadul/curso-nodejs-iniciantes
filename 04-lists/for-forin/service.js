const axios = require('axios');
const URL = 'https://swapi.dev/api/people';

async function obterPessoas(nome) {
  const url = `${URL}/?search=${nome}&format=json`;
  const response = await axios.get(url);
  return response.data;
}

// obterPessoas('r2')
//   .then(function (resultado) {
//     console.log('resultado', resultado);
//   })
//   .catch(function (error) {
//     console.error('OCORREU UM ERRO', error);
//   })

module.exports = {
  obterPessoas //No JavaScript, é o mesmo que 'obterPessoas: obterPessoas', pois a chave é igual ao valor.
}