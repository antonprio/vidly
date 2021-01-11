const auth = require('../middleware/authentication');
const { User, validateUser} = require('../models/user.model');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

/* Endpoint to get logged in user */
router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async(req, res) => {
    /*Validate user request, if error send 400 bad request */
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);    

    /*
    Validate user email coming from request, if the email come from request already exists in database
    then send 400 bad request
    */
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered.');

    /* Use (_) come from lodash library to simplified the object */
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    
    /* Salting and Hashing the password before save to database */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try{
        /* Save the user to db, then response the saved data without email */
        await user.save(user);
        return res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(ex) {
        return res.status(500).send(ex.message);
    } 
});

module.exports = router;