// docker ps
// docker exec -it 90517bb221be mongo -u felipefadul -p minhasenhasecreta --authenticationDatabase herois

// Databases
show dbs

// Muda o contexto para um database
use herois

// Mostrar tabelas (coleções)
show collections

db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
});

db.herois.find();
db.herois.find().pretty();

for(let i = 0; i <= 10000; i++) {
  db.herois.insert({
    nome: `Clone-${i}`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
  });
}

db.herois.count();
db.herois.findOne();
db.herois.find().limit(1000).sort({ nome: -1});
db.herois.find({}, { poder: 1, _id: 0});

// Create
db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
});

// Read
db.herois.find();

// Update
db.herois.update({ _id: ObjectId("5edd5819f9c5d8ce01c5153b") },
                 { nome: 'Mulher Maravilha' });

// Apagou o poder. No MongoDB deve-se deixar explícito os campos que devem continuar.
db.herois.find({nome: 'Mulher Maravilha'});

// Atualiza apenas o nome
db.herois.update({ _id: ObjectId("5edd5944f9c5d8ce01c51923") },
                 { $set: { nome: 'Lanterna Verde' } });

// Se passarmos uma campo que não existe, ele cria.
db.herois.update({ _id: ObjectId("5edd5944f9c5d8ce01c51923") },
                 { $set: { idade: 35 } });

// Por padrão, o update() só atualiza o primeiro que encontrar.
db.herois.update({ poder: 'Velocidade' },
                 { $set: { poder: 'Super Força' } });

// Delete
// Deleta todos com nome 'Lanterna Verde'
db.herois.remove({ nome: 'Lanterna Verde'});

//Deleta tudo
db.herois.remove({});