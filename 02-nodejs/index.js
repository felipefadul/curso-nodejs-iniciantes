/*
0 - Obter um usuário.
1 - Obter o número de telefone de um usuário a partir de seu ID.
2 - Obter o endereço do usuário pelo ID.
*/

//Método 3
const util = require('util');

const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
  //Quando der algum problema -> reject(ERRO)
  //Quando for sucesso -> resolve(SUCCESS)
  return new Promise(function resolvePromise (resolve, reject) {
    setTimeout(function () {
      //return reject(new Error('DEU RUIM DE VERDADE!'));
      return resolve({
        id: 1,
        nome: 'Aladin',
        dataNascimento: new Date()
      }) 
    }, 1000)
  })
}

//Convenção: callback é sempre o último parâmetro
function obterTelefone(idUsuario) {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(() => {
      return resolve({
        telefone: '11990002',
        ddd: 11
      })
    }, 2000)
  })
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0
    })
  }, 2000);
}

//1º passo adicionar a palavra async -> automaticamente ela retornará uma Promisse
main();
async function main() {
  try {
    console.time('medida-promise');
    const usuario = await obterUsuario();
    //const telefone = await obterTelefone(usuario.id);
    //const endereco = await obterEnderecoAsync(usuario.id);

    const resultado = await Promise.all([
      obterTelefone(usuario.id),
      obterEnderecoAsync(usuario.id)
    ]);

    const telefone = resultado[0];
    const endereco = resultado[1];

    console.log(`
      Nome: ${usuario.nome}
      Telefone: (${telefone.ddd}) ${telefone.telefone}
      Endereco: ${endereco.rua}, ${endereco.numero}
    `);
    console.timeEnd('medida-promise');
  }
  catch {
    console.error('OCORREU UM ERRO', error);
  }
}

/* 
//Método 2

//Importamos um módulo interno do node.js
const util = require('util');

const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
  //Quando der algum problema -> reject(ERRO)
  //Quando for sucesso -> resolve(SUCCESS)
  return new Promise(function resolvePromise (resolve, reject) {
    setTimeout(function () {
      //return reject(new Error('DEU RUIM DE VERDADE!'));
      return resolve({
        id: 1,
        nome: 'Aladin',
        dataNascimento: new Date()
      }) 
    }, 1000)
  })
}

//Convenção: callback é sempre o último parâmetro
function obterTelefone(idUsuario) {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(() => {
      return resolve({
        telefone: '11990002',
        ddd: 11
      })
    }, 2000)
  })
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0
    })
  }, 2000);
}

const usuarioPromise = obterUsuario();
//Para manipular o sucesso, usamos a função .then()
//Para manipular erros, usamos o .catch()
//usuario -> usuario e telefone -> usuario, telefone e endereco
usuarioPromise
  .then(function (usuario) {
    return obterTelefone(usuario.id)
      .then(function resolverTelefone(result) {
        return {
          usuario: {
            nome: usuario.nome,
            id: usuario.id
          },
          telefone: result
        }
      });
  })
  .then(function (resultado) {
    const endereco = obterEnderecoAsync(resultado.usuario.id);
    return endereco.then(function resolverEndereco(result) {
      return {
        usuario: resultado.usuario,
        telefone: resultado.telefone,
        endereco: result
      }
    });
  })
  .then(function (resultado) {
    console.log(`
      Nome: ${resultado.usuario.nome}
      Endereço: ${resultado.endereco.rua}, ${resultado.endereco.numero}
      Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
    `);
  })
  .catch(function (error) {
    console.error('OCORREU UM ERRO', error);
  })*/

/*
//Método 1
function obterUsuario(callback) {
  setTimeout(function () {
    return callback(null, {
      id: 1,
      nome: 'Aladin',
      dataNascimento: new Date()
    }) 
  }, 1000)
}

//Convenção: callback é sempre o último parâmetro
function obterTelefone(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      telefone: '11990002',
      ddd: 11
    })
  }, 2000)
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0
    })
  }, 2000);
}*/

//Convenção: error é sempre o primeiro parâmetro e o segundo é o sucesso.
/*obterUsuario(function resolverUsuario(error, usuario) {
  null || undefined || "" || 0 === false
  if(error) {
    console.error('OCORREU UM ERRO EM USUARIO', error);
    return;
  }
  obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
    if(error1) {
      console.error('OCORREU UM ERRO EM TELEFONE', error);
      return;
    }
    
    obterEndereco(usuario.id, function resolverEndereco(error2, endereco) {
      if (error2) {
        console.error('OCORREU UM ERRO EM ENDERECO', error);
        return;
      }

      console.log(`
        Nome: ${usuario.nome}
        Endereço: ${endereco.rua}, ${endereco.numero}
        Telefone: (${telefone.ddd}) ${telefone.telefone}
      `);
    })
  });
});*/


// const telefone = obterTelefone(usuario.id);

// console.log('usuario', usuario);
// console.log('telefone', telefone);