const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await authService.register(email, password);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await authService.login(email, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      res.json({
        success: true,
        user: {
          id: req.user.userId,
          email: req.user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user info',
        error: error.message,
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required',
        });
      }

      const decoded = authService.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }

      res.json({
        success: true,
        isValid: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Token verification failed',
        error: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '100d',
      });
      const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
      res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
}

module.exports = new AuthController();
