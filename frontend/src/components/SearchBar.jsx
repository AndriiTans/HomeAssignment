import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import useDebounced from '../hooks/useDebounced';

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounced(onSearch, 700);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
      <Paper elevation={1} sx={{ p: 0.5 }}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder || 'Search...'}
          variant="outlined"
          Props={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton aria-label="clear search" onClick={handleClear} edge="end" size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};

export default SearchBar;
