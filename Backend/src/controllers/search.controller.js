const searchService = require('../services/search.service');

class SearchController {
  async searchSongs(req, res) {
    try {
      const query = req.query.searchBy || '';
      const results = await searchService.searchSongs(query);
      return res.json(results);
    } catch (error) {
      console.error('Error searching songs:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new SearchController();
