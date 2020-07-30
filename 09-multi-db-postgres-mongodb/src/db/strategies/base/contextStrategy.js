class ContextStrategy {
  constructor(strategy) {
    this._database = strategy;
  }

  create(item) {
    // Se o banco de dados não tiver o método create(), tentará usar o do ICrud e lançará exceção.
    return this._database.create(item);
  }

  read(item, skip, limit) {
    return this._database.read(item, skip, limit);
  }

  update(id, item) {
    return this._database.update(id, item);
  }

  delete(id) {
    return this._database.delete(id);
  }

  isConnected() {
    return this._database.isConnected();
  }

  connect() {
    return this._database.connect();
  }
}

module.exports = ContextStrategy;