class SearchSchema {
  static validate(data) {
    const requiredFields = ['query'];
    const errors = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    }

    if (typeof data.query !== 'string') {
      errors.push('query must be a string');
    }

    if (data.query && data.query.length < 1) {
      errors.push('query must not be empty');
    }

    if (data.query && data.query.length > 500) {
      errors.push('query must not exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static format(data) {
    return {
      id: Date.now().toString(),
      query: data.query.trim(),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = SearchSchema;
