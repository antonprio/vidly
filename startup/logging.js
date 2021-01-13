const winston = require('winston');
require('express-async-errors');
require('winston-mongodb');

module.exports = function () {
    /* Log the uncaughtException to the file */
    winston.handleExceptions(
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        }),
        new winston.transports.File({
            filename: './logfiles/uncaughtException.log'
        }));

    /* throw the exeception, so winston can caught the exception */
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.File, {
        filename: './logfiles/logger.log'
    });
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost/vidly'
    });
}