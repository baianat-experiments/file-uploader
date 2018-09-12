const http = require('http');
const chalk = require('chalk');
const port = 5001

const server = http.createServer(function (request, response) {
  console.log(chalk.green('🙈  I\'ve got something!'));

  // enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');

  response.writeHead(200);
  setTimeout(() => {
    request.pipe(response);
  }, 500);

});

server.listen(port, () => {
  console.log(chalk.green('🙉  Echo server hears you!'), chalk.blue(`http://localhost:${port}`));
});
