import React, { useState } from 'react';
import InputBase from '@mui/material/InputBase';
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
      <Paper
        elevation={1}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SearchIcon sx={{ ml: 1, color: 'action.active' }} />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{
            'aria-label': 'search music',
          }}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <IconButton size="small" onClick={handleClear} sx={{ mr: 0.5 }}>
            <ClearIcon />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar;
