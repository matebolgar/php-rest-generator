import {readdir, readFile} from 'fs';
import {join} from 'path';
import {OutputFile, Schema} from '../template';

const readRaw = filename => new Promise((resolve, reject) => {
  readFile(filename, (err, data) => {
    err ? reject(err) : resolve(data.toString());
  });
});

const readDir = folderName => new Promise((resolve, reject) => {
  readdir(folderName, (err, files) => {
    err ? reject(err) : resolve(files);
  });
});

const zip = (arr, ...arrs) =>
  arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));

const parseFile = namespaceRoot => filename => readRaw(filename)
  .then((content: string) => content.replace(/RootNamespace/g, namespaceRoot));


const filecontent = schema => src => filenames => new Promise(resolve => resolve(filenames))
  .then((filenames: string[]) => filenames.map(name => join(src, name)))
  .then((filenames: string[]) => Promise.all(filenames.map(parseFile(schema.namespaceRoot))));


const readAndWrite = schema => src => dest =>
  readDir(src)
    .then(filenames => filecontent(schema)(src)(filenames)
      .then(contents => zip(filenames, contents)))
    .then(fileNamesAndContents => fileNamesAndContents.map(item => ({
      filename: join('Generated', dest, item[0]),
      content: item[1]
    })));

export const auth = async (schema: Schema): Promise<OutputFile[]> =>
  [
    ...await readAndWrite(schema)(`${__dirname}/controller`)('Auth'),
    ...await readAndWrite(schema)(`${__dirname}/repository`)(join('Repository', 'Auth')),
    ...await readAndWrite(schema)(`${__dirname}/route`)(join('Route', 'Auth')),
  ];



