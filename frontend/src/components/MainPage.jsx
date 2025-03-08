import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import apiClient from '../utils/httpClient';
import SearchBar from './SearchBar';
import SmartTable from './SmartTable';

const MainPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { key: 'title', label: 'Title', sortable: true, filterable: true },
    { key: 'artist', label: 'Artist', sortable: true, filterable: true },
    { key: 'album', label: 'Album', sortable: true, filterable: true },
    { key: 'year', label: 'Year', sortable: true, filterable: true },
    { key: 'genre', label: 'Genre', sortable: true, filterable: true },
  ];

  const handleSearch = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/search?searchBy=${encodeURIComponent(searchTerm)}`);

      setSearchResults(response.data);
      setTotalItems(response.data.length);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Music Search
        </Typography>

        <Box sx={{ mb: 4 }}>
          <SearchBar onSearch={handleSearch} placeholder="Search for music..." />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          searchResults.length > 0 && (
            <SmartTable
              data={searchResults}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={totalItems}
            />
          )
        )}
      </Box>
    </Container>
  );
};

export default MainPage;
