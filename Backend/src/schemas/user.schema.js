class UserSchema {
  static validate(data) {
    const requiredFields = ['email', 'password'];
    const errors = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static format(data) {
    return {
      id: data.id || Date.now().toString(),
      email: data.email.toLowerCase(),
      password: data.password,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  }
}

module.exports = UserSchema;
