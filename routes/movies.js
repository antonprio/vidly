const auth = require('../middleware/authentication');
const { Movie } = require('../models/movie.model');
const { Genre } = require('../models/genre.model');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movie = await Movie.find();

    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);    

    if(!genre) return res.status(404).send('Genre Id Not Found..');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie.save();

    res.send(movie);
});

module.exports = router;