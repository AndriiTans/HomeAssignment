const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  async register(email, password) {
    try {
      const user = await userModel.createUser({ email, password });
      const token = this.generateToken(user);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async login(email, password) {
    try {
      const user = await userModel.validateUser(email, password);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const token = this.generateToken(user);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  generateToken(user) {
    return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthService();
