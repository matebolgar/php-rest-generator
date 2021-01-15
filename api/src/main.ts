const express = require('express');
const app = express();
const rp = require('request-promise');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
const client = new MongoClient(process.env['DB_CONNECTION'], {useNewUrlParser: true});

const fileUpload = require('express-fileupload');
app.use(fileUpload());

export const save = (schema) => client
  .db('ce-db')
  .collection('restSchema')
  .insertOne(schema);

export const update = (schema, id) => client
  .db('ce-db')
  .collection('restSchema')
  .findOneAndReplace(
    {_id: new ObjectId(id)},
    schema,
    {returnOriginal: false}
  );

export const deleteSchema = id => client
  .db('ce-db')
  .collection('restSchema')
  .findOneAndDelete({_id: new ObjectId(id)});
  

export const list = query => client
  .db('ce-db')
  .collection('restSchema')
  .find()
  .toArray();

export const byId = id => client
  .db('ce-db')
  .collection('restSchema')
  .findOne({_id: new ObjectId(id)})
  .then(item => item ? item : Promise.reject('not found'));


const cors = require('cors');

app.use(cors());

app.get('/schema', (req, res) => {
  list({})
    .then((result) => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send({err: true});
    });
});

app.get('/export-schema/:schemaId', function (req, res) {
  byId(req.params.schemaId)
    .then(schema => {
      res.set('Content-disposition', `attachment; filename=${schema.name}.json`);
      res.send(JSON.stringify(schema));
    })
    .catch(err => {
      console.log(err);
      res.send({err: true});
    });
});


app.post('/import-schema', function (req, res) {
  const schema = JSON.parse(req.files.import.data.toString());
  delete schema.id;
  delete schema._id;
  save(schema)
    .then((result) => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send({err: true});
    });
});


app.post('/schema', bodyParser.json(), (req, res) => {
  save(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send({err: true});
    });
});

app.put('/schema/:schemaId', bodyParser.json(), (req, res) => {
  update(req.body, req.params.schemaId)
    .then((result) => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send({err: true});
    });
});

app.get('/schema/:schemaId', function (req, response) {
  byId(req.params.schemaId)
    .then(schema => {
      response.send(schema);
    })
    .catch(err => {
      console.log(err);
      response.send({err: true});
    });
});

app.delete('/schema/:schemaId', function (req, response) {
  deleteSchema(req.params.schemaId)
    .then(schema => {
      response.send(schema);
    })
    .catch(err => {
      console.log(err);
      response.send({err: true});
    });
});


app.get('/download-generated/:schemaId', function (req, response) {
  byId(req.params.schemaId)
    .then(schema => {
      rp({
        method: 'POST',
        uri: 'http://generator_process:3000',
        body: JSON.stringify(schema),
      }).pipe(response);
    })
    .catch(err => {
      console.log(err);
      response.send({err: true});
    });
});

client.connect(err => {
  if (err) {
    process.exit();
  }
  app.listen(8080);
});
