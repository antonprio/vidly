const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    const dbConfig = config.get('db');
    mongoose.connect(dbConfig, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => winston.info(`Connected to ${dbConfig}..`));
}