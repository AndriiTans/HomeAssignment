const express = require('express');
const favoritesController = require('../controllers/favorites.controller');
const router = express.Router();

router.post('/', (req, res) => favoritesController.addFavorite(req, res));
router.get('/', (req, res) => favoritesController.getFavorites(req, res));

module.exports = router;
