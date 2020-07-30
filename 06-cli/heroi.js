class Heroi {
  constructor({ id, nome, poder }) {
    this.id = id ? parseInt(id) : id,
    this.nome = nome,
    this.poder = poder
  }
}

module.exports = Heroi;