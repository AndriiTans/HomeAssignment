const fs = require('fs').promises;
const path = require('path');
const FavoritesSchema = require('../schemas/favorites.schema');

const FAVORITES_FILE = path.join(__dirname, '../data/favorites.json');

class FavoritesModel {
  constructor() {
    this.ensureFileExists();
  }

  async ensureFileExists() {
    try {
      await fs.access(FAVORITES_FILE);
    } catch {
      await fs.writeFile(FAVORITES_FILE, JSON.stringify({ favorites: [] }, null, 2));
    }
  }

  async getFavorites() {
    const data = await fs.readFile(FAVORITES_FILE, 'utf8');
    const favorites = JSON.parse(data).favorites;
    return favorites;
  }

  async addFavorite(songId) {
    const validation = FavoritesSchema.validate({ songId });
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const favorites = await this.getFavorites();

    const exists = favorites.some((fav) => fav.songId === songId);

    if (exists) {
      return null;
    }

    const favoriteEntry = FavoritesSchema.format({ songId });
    favorites.push(favoriteEntry);

    await fs.writeFile(FAVORITES_FILE, JSON.stringify({ favorites }, null, 2));
    return favoriteEntry;
  }

  async removeFavorite(songId) {
    const favorites = await this.getFavorites();
    const filteredFavorites = favorites.filter((fav) => !(fav.songId === songId));

    if (filteredFavorites.length === favorites.length) {
      return null;
    }

    await fs.writeFile(FAVORITES_FILE, JSON.stringify({ favorites: filteredFavorites }, null, 2));
    return songId;
  }

  async clearFavorites() {
    await fs.writeFile(FAVORITES_FILE, JSON.stringify({ favorites: [] }, null, 2));
  }
}

module.exports = new FavoritesModel();
