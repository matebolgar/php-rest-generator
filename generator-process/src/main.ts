import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import * as path from "path";
import { toFiles, OutputFile } from "./template";
import { transformSchema } from "./transformer";
import { validateJson } from "./validation";

const JSZip = require("jszip");

const readJSON = (filename) =>
  new Promise((resolve, reject) => {
    readFile(filename, "utf8", (err, data) => {
      err ? reject("invalid file") : resolve(JSON.parse(data));
    });
  });

const writePHP = (file: OutputFile) =>
  new Promise((resolve, reject) => {
    writeFile(file.filename, file.content, (err) => {
      err ? reject(err) : resolve();
    });
  });

const createDirectoryForFile = (filePath) =>
  new Promise((resolve) => {
    const dirname = path.dirname(filePath);
    if (existsSync(dirname)) {
      resolve();
    }
    createDirectoryForFile(dirname);
    mkdirSync(dirname);
    resolve();
  });

const archiver = require("archiver");

function zipDirectory(source, response) {
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err) => reject(err))
      .pipe(response);

    response.on("close", () => resolve());
    archive.finalize();
  });
}

const http = require("http");

const getBody = (request): any =>
  new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      resolve(body);
    });
  });

http
  .createServer(async (req, response) => {
    const body = JSON.parse(await getBody(req));
    const item = transformSchema(await validateJson(body));

    const filesPrs = await toFiles(item);

    const contents = await Promise.all.call(Promise, filesPrs);

    response.setHeader("Content-Type", "application/zip");
    response.setHeader("Content-disposition", `attachment; filename=generated.zip`);

    const zip = new JSZip();

    contents.forEach((item) => {
      zip.file(item.filename, item.content);
    });

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(response)
      .on("finish", function () {
        console.log("out.zip written.");
      });
  })
  .listen(3000);
