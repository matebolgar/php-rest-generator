const express = require("express");
const app = express();
const rp = require("request-promise");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

const getClient = (): any => {
  return new Promise((res, rej) => {
    const client = new MongoClient(process.env["DB_CONNECTION"], { useNewUrlParser: true, useUnifiedTopology: true });
    return client.connect(function (err, db) {
      res(db);
    });
  });
};

process.on("uncaughtException", function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

const fileUpload = require("express-fileupload");
app.use(fileUpload());

export const save = async (schema) => {
  const client = await getClient();
  return client.db("ce-db").collection("restSchema").insertOne(schema);
};

export const update = async (schema, id) => {
  const client = await getClient();
  return client
    .db("ce-db")
    .collection("restSchema")
    .findOneAndReplace({ _id: new ObjectId(id) }, schema, { returnOriginal: false });
};

export const deleteSchema = async (id) => {
  const client = await getClient();
  return client
    .db("ce-db")
    .collection("restSchema")
    .findOneAndDelete({ _id: new ObjectId(id) });
};

export const list = async (query) => {
  const client = await getClient();
  return client.db("ce-db").collection("restSchema").find().toArray();
};

export const byId = async (id) => {
  const client = await getClient();
  return client
    .db("ce-db")
    .collection("restSchema")
    .findOne({ _id: new ObjectId(id) })
    .then((item) => (item ? item : Promise.reject("not found")));
};

const cors = require("cors");

app.use(cors());

app.use('/', express.static(__dirname + "/php-rest-generator-app"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/php-rest-generator-app/index.html");
});

app.get("/schema", (req, res) => {
  list({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: true });
    });
});

app.get("/export-schema/:schemaId", function (req, res) {
  byId(req.params.schemaId)
    .then((schema) => {
      res.set("Content-disposition", `attachment; filename=${schema.name}.json`);
      res.send(JSON.stringify(schema));
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: true });
    });
});

app.post("/import-schema", function (req, res) {
  const schema = JSON.parse(req.files.import.data.toString());
  delete schema.id;
  delete schema._id;
  save(schema)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: true });
    });
});

app.post("/schema", bodyParser.json(), (req, res) => {
  save(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: true });
    });
});

app.put("/schema/:schemaId", bodyParser.json(), (req, res) => {
  update(req.body, req.params.schemaId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send({ err: true });
    });
});

app.get("/schema/:schemaId", function (req, response) {
  byId(req.params.schemaId)
    .then((schema) => {
      response.send(schema);
    })
    .catch((err) => {
      console.log(err);
      response.send({ err: true });
    });
});

app.delete("/schema/:schemaId", function (req, response) {
  deleteSchema(req.params.schemaId)
    .then((schema) => {
      response.send(schema);
    })
    .catch((err) => {
      console.log(err);
      response.send({ err: true });
    });
});

app.get("/download-generated/:schemaId", function (req, response) {
  req.on("error", (err) => {
    console.log(err);
  });

  byId(req.params.schemaId)
    .then((schema) => {
      rp({
        method: "POST",
        uri: "http://generator_process:3000",
        body: JSON.stringify(schema),
      })
        .pipe(response)
        .on("error", (err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      response.send({ err: true });
    });
});

// client.connect(err => {
//   if (err) {
//     process.exit();
//   }
app.listen(8080, () => {
  console.log("PHP REST Generator active at port 8080");
});
// });
