import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

const SmartTable = ({
  data,
  columns,
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  totalItems,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    onPageChange(0);
  };

  const processedData = useMemo(() => {
    let filteredData = [...data];

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filteredData = filteredData.filter((item) =>
          String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase()),
        );
      }
    });

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, filters, sortConfig]);

  const getDistinctValues = (column) => {
    return [...new Set(data.map((item) => item[column]))];
  };

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {columns
          .filter((col) => col.filterable)
          .map((column) => (
            <FormControl key={column.key} size="small" sx={{ minWidth: 120 }}>
              <InputLabel id={`filter-${column.key}-label`}>{column.label}</InputLabel>
              <Select
                labelId={`filter-${column.key}-label`}
                value={filters[column.key] || ''}
                label={column.label}
                onChange={(e) => handleFilter(column.key, e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {getDistinctValues(column.key).map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sortDirection={sortConfig.key === column.key ? sortConfig.direction : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortConfig.key === column.key}
                      direction={sortConfig.key === column.key ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalItems}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default SmartTable;
