require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const searchRoutes = require('./routes/search.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
require('fs').mkdirSync(dataDir, { recursive: true });

app.use('/api/auth', authRoutes);

app.use('/api/search', authMiddleware, searchRoutes);
app.use('/api/favorites', authMiddleware, favoritesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
