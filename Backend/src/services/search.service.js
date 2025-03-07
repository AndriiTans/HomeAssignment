const songs = require('../data/songs.json').songs;
const searchModel = require('../models/search.model');

class SearchService {
  async getSearchHistory() {
    return searchModel.getSearchHistory();
  }

  async searchSongs(query) {
    let searchEntry;
    if (query) {
      searchEntry = await searchModel.addSearch(query);
    }

    if (!query) return songs;

    const lowerQuery = query.toLowerCase();
    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery) ||
        song.genre.toLowerCase().includes(lowerQuery),
    );

    if (searchEntry) {
      await searchModel.updateSearchResults(searchEntry.id, results.length);
    }

    return results;
  }

  async searchSongsByIds(ids) {
    const results = songs.filter((song) => ids.includes(song.id));

    return results;
  }

  getAllSongs() {
    return songs;
  }

  async clearSearchHistory() {
    return searchModel.clearHistory();
  }
}

module.exports = new SearchService();
