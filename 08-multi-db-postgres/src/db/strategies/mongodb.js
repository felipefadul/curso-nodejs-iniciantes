const ICrud = require ('./interfaces/interfaceCrud');

class MongoDB extends ICrud {
  constructor() {
    super(); // Invoca o construtor do ICrud.
  }

  create(item) {
    console.log('O item foi salvo em MongoDB.');
  }
}

module.exports = MongoDB;