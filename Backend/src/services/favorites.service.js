const songs = require('../data/songs.json').songs;
const favoritesModel = require('../models/favorites.model');

class FavoritesService {
  async getFavorites() {
    try {
      const favorites = await favoritesModel.getFavorites();

      const songsMap = new Map(songs.map((song) => [song.id, song]));

      const enrichedFavorites = favorites.map((favorite) => {
        const song = songsMap.get(favorite.songId);
        return {
          id: favorite.id,
          addedAt: favorite.addedAt,
          song: song || {
            id: favorite.songId,
            title: 'Song not found',
            status: 'deleted',
          },
        };
      });

      return enrichedFavorites.filter((fav) => fav !== null);
    } catch (error) {
      throw new Error(`Failed to get favorites: ${error.message}`);
    }
  }

  async addFavorite(songId) {
    try {
      const song = songs.find((s) => s.id === songId);
      if (!song) {
        return { success: false, message: 'Song not found.' };
      }

      const favorite = await favoritesModel.addFavorite(songId);
      if (!favorite) {
        return { success: false, message: 'Already in favorites.' };
      }

      return {
        success: true,
        favorite: {
          ...favorite,
          song,
        },
      };
    } catch (error) {
      throw new Error(`Failed to add favorite: ${error.message}`);
    }
  }

  async removeFavorite(songId) {
    try {
      const removed = await favoritesModel.removeFavorite(songId);
      if (!removed) {
        return { success: false, message: 'Favorite not found.' };
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }

  async clearFavorites() {
    try {
      await favoritesModel.clearFavorites();
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to clear favorites: ${error.message}`);
    }
  }
}

module.exports = new FavoritesService();
