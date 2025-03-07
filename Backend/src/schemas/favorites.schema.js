class FavoritesSchema {
  static validate(data) {
    const requiredFields = ['songId'];

    const errors = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static format(data) {
    return {
      id: Date.now().toString(),
      songId: data.songId,
      addedAt: new Date().toISOString(),
    };
  }
}

module.exports = FavoritesSchema;
