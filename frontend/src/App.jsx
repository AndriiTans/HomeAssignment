import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import MainPage from './Components/MainPage';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import NotFound from './Components/NotFound';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log('isAuthenticated -> ', isAuthenticated);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Router>
        <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/songs" /> : <Login />} />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/songs" /> : <Register />}
            />
            <Route
              path="/songs"
              element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/songs" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
