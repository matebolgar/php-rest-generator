import {existsSync, mkdirSync, readFile, writeFile} from 'fs';
import * as path from 'path';
import {files, OutputFile} from './template';
import {transformSchema} from './transformer';
import {validateJson} from './validation';


const readJSON = filename => new Promise((resolve, reject) => {
  readFile(filename, 'utf8', (err, data) => {
    err ? reject('invalid file') : resolve(JSON.parse(data));
  });
});

const writePHP = (file: OutputFile) => new Promise((resolve, reject) => {
  writeFile(file.filename, file.content, err => {
    err ? reject(err) : resolve();
  });
});

const createDirectoryForFile = filePath => new Promise((resolve) => {
  const dirname = path.dirname(filePath);
  if (existsSync(dirname)) {
    resolve();
  }
  createDirectoryForFile(dirname);
  mkdirSync(dirname);
  resolve();
});

const archiver = require('archiver');

function zipDirectory(source, response) {
  const archive = archiver('zip', {zlib: {level: 9}});

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(response);

    response.on('close', () => resolve());
    archive.finalize();
  });
}


const http = require('http');


const getBody = request => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', () => {
    resolve(body);
  });
});

http.createServer((req, response) => {
  getBody(req)
    .then(JSON.parse)
    .then(validateJson)
    .then(transformSchema)
    .then(files)
    .then(promises => Promise.all.call(Promise, promises))
    .then((result) => {
      response.setHeader('Content-Type', 'application/zip');
      response.setHeader('Content-disposition', `attachment; filename=generated.zip`);

      const zip = archiver('zip', {zlib: {level: 9}});

      result.forEach(item => {
        zip.append(item.content, {name: item.filename});
      });

      zip.pipe(response);
      zip.finalize();
    })
    .catch(err => {
      console.log(err);
      response.end();
    });

})
  .listen(3000);














