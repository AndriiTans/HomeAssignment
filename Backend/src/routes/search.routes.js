const express = require('express');
const searchController = require('../controllers/search.controller');
const router = express.Router();

router.get('/', (req, res) => searchController.searchSongs(req, res));

module.exports = router;
