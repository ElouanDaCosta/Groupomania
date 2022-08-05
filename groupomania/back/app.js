const express = require('express');
const app = express();
const connection = require('./config/connection');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //tous les accèsss depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //autorisation des headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //autorisation des méthodes
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});

app.use('/images' , express.static('images'));

app.use(express.json());  //Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;