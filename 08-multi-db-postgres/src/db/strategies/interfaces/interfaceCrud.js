class NotImplementedException extends Error {
  constructor() {
    super("Not Implemented Exception");
  }
}

// Classe ICrud funcionará como uma interface, estabelecendo um contrato que
// os bancos de dados devem seguir.
class ICrud {
  create(item) {
    throw new NotImplementedException();
  }

  read(query) {
    throw new NotImplementedException();
  }

  update(id, item) {
    throw new NotImplementedException();
  }

  delete(id) {
    throw new NotImplementedException();
  }

  isConnected() {
    throw new NotImplementedException();
  }

  connect() {
    throw new NotImplementedException();
  }
}

module.exports = ICrud;