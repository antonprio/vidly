const { User } = require('../models/user.model');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async(req, res) => {
    /*Validate user request, if error send 400 bad request */
    const { error } = validateLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);    

    /*
    Validate user email coming from request, if the email come from request not exists in database
    then send 400 bad request
    */
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    /* Use bcrypt compare function, to compare plain text from request to hashed password in db */
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password');

    /* If all set, then generate the token and set it to response header */
    const token = user.generateAuthToken();

    return res.header('x-auth-token', token).send('Authenticated');
});

function validateLogin(req) {
    const schema = {        
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }

    return Joi.validate(req, schema);
}

module.exports = router;