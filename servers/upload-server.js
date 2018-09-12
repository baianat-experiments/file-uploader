const http = require('http');
const chalk = require('chalk');
const path = require('path');
const formidable = require('formidable');
const filesize = require('filesize');
const { getFileType } = require('./utils');
const fs = require('fs');
const url = require('url');
const uploadFolder = './upload';
const port = 5000
const origin = `http://localhost:${port}`

const server = http.createServer(function (request, response) {
  // enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');

  if (
    request.method.toUpperCase() === 'GET' &&
    request.url.startsWith('/files')
    ) {

    response.writeHead(200, { 'Content-Type': 'text/html' });
    const directory = request.url.replace('/files','');
    const currentDirectory = path.join(uploadFolder, directory);
    const files = fs.readdir(currentDirectory, (err, files) => {
      let data = [];
      if (err) {
        console.log(err)
        return;
      }
      files.forEach((file) => {
        const filePath = path.join(currentDirectory, file);
        const stats = fs.statSync(filePath);
        const isDirectory = stats.isDirectory();
        const size = filesize(stats.size);
        if (isDirectory) {
          data.push({ name: file, isDirectory, size, path: filePath });
          return;
        }
        const ext = path.extname(file);
        const type = getFileType(ext.replace(/\./g, ''));
        data.push({ name: file, ext, isDirectory, size, type, path: `${origin}/${filePath}` });
      });
      response.write(JSON.stringify(data));
      response.end();
    });
    return;
  }

  if (request.method.toUpperCase() === 'GET') {
    const fileName = path.join('./', request.url);
    fs.readFile(fileName, (err, file) => {
      if (err) {
        console.log(err);
        return;
      }
      response.writeHead(200, { 'Content-Type': 'image/jpg' });
      response.end(file, 'binary');
    });

    return;
  }
  
  if (request.method.toUpperCase() === 'POST') {
    // parse a file upload
    const form = new formidable.IncomingForm();
    const uploadPath = path.join(uploadFolder, request.url);
    form.uploadDir = uploadPath;
 
    form.parse(request, (error, fields, files) => {
      response.writeHead(200, {'content-type': 'text/plain'});
      const tempPath = files.file.path;
      const newPath = path.join(uploadPath, files.file.name);
      fs.rename(tempPath, newPath, (err) => {
        if (err) { 
          throw err;
        }
        console.log(`😎 ${files.file.name} uploaded successfully`);
      });
      response.end();
    });
 
    return;
  }

  if (request.method.toUpperCase() === 'DELETE') {
    response.writeHead(200);
    const filePath = path.join(uploadFolder, request.url);
    fs.unlink(filePath, (err) => {
      if (err) { 
        throw err;
      }
      console.log(`😫 ${request.url} deleted successfully`);
      response.end();
    });

    return;
  }
 
  // show a file upload form
  response.writeHead(200, {'content-type': 'text/html'});
  response.end();
});

server.listen(port, () => {
  console.log(chalk.green('🙉  Upload server hears you!'), chalk.blue(`http://localhost:${port}`));
});
