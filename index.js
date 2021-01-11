const winston = require('winston');
const error = require('./middleware/error');
require('winston-mongodb');
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
require('express-async-errors');

winston.add(winston.transports.File, { filename: 'logger.log' });
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });

if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDb..'))
    .catch(err => console.error('Could not connect to MongoDb..'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));