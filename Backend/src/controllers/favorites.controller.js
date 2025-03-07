const favoritesService = require('../services/favorites.service');

class FavoritesController {
  async addFavorite(req, res) {
    try {
      const { songId } = req.body;
      const result = favoritesService.addFavorite(songId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (error) {
      console.error('Error adding favorite:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getFavorites(req, res) {
    try {
      const favs = favoritesService.getFavorites();
      return res.json(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new FavoritesController();
