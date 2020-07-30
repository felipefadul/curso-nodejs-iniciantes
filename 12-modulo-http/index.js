const http = require('http');

const PORT = 5000;

http.createServer((request, response) => {
  response.end('Hello, Node!!!');
})
.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}.`));