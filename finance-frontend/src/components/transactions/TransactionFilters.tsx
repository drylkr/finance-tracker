import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Menu,
  MenuItem,
  Popover,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
  Checkbox,
  FormControlLabel,
  Divider,
  useMediaQuery,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface TransactionFilterProps {
  onFilter: (filters: {
    search: string;
    startDate: string;
    endDate: string;
    types: string[];
    amountRange: [number, number];
  }) => void;
  sortOrder?: "newest" | "oldest";
  onSortChange?: (sort: "newest" | "oldest") => void;
}

const TransactionFilters = ({ 
  onFilter, 
}: TransactionFilterProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxAmount, setMaxAmount] = useState<number | ''>('');
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);
  const [amountAnchorEl, setAmountAnchorEl] = useState<null | HTMLElement>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);

  const transactionTypes = ['Income', 'Expense', 'Investment'];

  const applyFilters = () => {
    onFilter({
      search,
      startDate,
      endDate,
      types: selectedTypes,
      amountRange: [
        typeof minAmount === 'number' ? minAmount : 0,
        typeof maxAmount === 'number' ? maxAmount : Number.MAX_SAFE_INTEGER
      ]
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setSelectedTypes([]);
    setMinAmount('');
    setMaxAmount('');
    onFilter({
      search: '',
      startDate: '',
      endDate: '',
      types: [],
      amountRange: [0, Number.MAX_SAFE_INTEGER]
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    applyFilters();
  }, [selectedTypes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTypeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTypeAnchorEl(event.currentTarget);
  };

  const handleTypeMenuClose = () => {
    setTypeAnchorEl(null);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prev) => {
      let updated;
      if (prev.includes(type)) {
        updated = prev.filter((t) => t !== type);
      } else {
        updated = prev.length >= 2 ? [prev[1], type] : [...prev, type];
      }
      return updated;
    });
  };

  const handleClearTypes = () => {
    setSelectedTypes([]);
  };

  const handleAmountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAmountAnchorEl(event.currentTarget);
  };

  const handleAmountMenuClose = () => {
    setAmountAnchorEl(null);
  };

  const handleAmountApply = () => {
    handleAmountMenuClose();
    applyFilters();
  };

  const handleDateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateMenuClose = () => {
    setDateAnchorEl(null);
  };

  const handleDateApply = () => {
    handleDateMenuClose();
    applyFilters();
  };

  const hasActiveFilters =
    search || startDate || endDate || selectedTypes.length > 0 || minAmount !== '' || maxAmount !== '';

  const buttonStyle = {
    borderColor: 'secondary.dark',
    color: 'secondary.dark',
    '&:hover': {
      borderColor: 'text.secondary',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      color: "text.secondary"
    },
    '&.active': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main
    }
  };

  const clearButtonStyle = hasActiveFilters
    ? {
        borderColor: '#d32f2f',
        color: '#d32f2f',
        '&:hover': {
          borderColor: '#b71c1c',
          backgroundColor: 'rgba(211, 47, 47, 0.04)'
        }
      }
    : {
        borderColor: 'rgba(0, 0, 0, 0.12)',
        color: 'rgba(0, 0, 0, 0.26)'
      };

  const applyButtonStyle = {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      borderColor: theme.palette.primary.dark,
      backgroundColor: 'rgba(25, 118, 210, 0.04)'
    }
  };

  // Render the search field in a responsive way
  const renderSearchField = () => (
    <TextField
      placeholder="Search transactions..."
      variant="outlined"
      size="small"
      value={search}
      onChange={handleSearchChange}
      sx={{ width: isMobile ? '100%' : '400px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: search ? (
          <InputAdornment position="end">
            <IconButton edge="end" size="small" onClick={() => setSearch('')}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  );

  // Render filter buttons in a responsive way
  const renderFilterButtons = () => (
    <Stack 
      direction={isMobile ? "column" : "row"} 
      spacing={isMobile ? 1 : 2}
      sx={{ width: isMobile ? '100%' : 'auto' }}
    >
      
      {/* Date Filter */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleDateMenuOpen}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          ...buttonStyle,
          ...(startDate || endDate ? { '&.active': buttonStyle['&.active'] } : {}),
          ...(isMobile && { width: '100%' })
        }}
        className={startDate || endDate ? 'active' : ''}
      >
        {startDate && endDate
          ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
          : startDate
          ? `From ${new Date(startDate).toLocaleDateString()}`
          : endDate
          ? `Until ${new Date(endDate).toLocaleDateString()}`
          : 'Date Range'}
      </Button>

      {/* Type Filter */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleTypeMenuOpen}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          ...buttonStyle,
          ...(selectedTypes.length > 0 ? { '&.active': buttonStyle['&.active'] } : {}),
          ...(isMobile && { width: '100%' })
        }}
        className={selectedTypes.length > 0 ? 'active' : ''}
      >
        {selectedTypes.length > 0 ? selectedTypes.join(', ') : 'Type'}
      </Button>

      {/* Amount Filter */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleAmountMenuOpen}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          ...buttonStyle,
          ...(minAmount !== '' || maxAmount !== '' ? { '&.active': buttonStyle['&.active'] } : {}),
          ...(isMobile && { width: '100%' })
        }}
        className={minAmount !== '' || maxAmount !== '' ? 'active' : ''}
      >
        {minAmount !== '' || maxAmount !== '' ? `$${minAmount || 0} - $${maxAmount || '∞'}` : 'Amount'}
      </Button>

      {/* Clear Filters */}
      <Button
        variant="outlined"
        size="small"
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        sx={{
          ...clearButtonStyle,
          ...(isMobile && { width: '100%' })
        }}
      >
        Clear Filters
      </Button>
    </Stack>
  );

  return (
    <Box sx={{ mb: 3, mt: 1 }}>
      {/* Mobile view - stack everything vertically */}
      {isMobile ? (
        <Stack spacing={2} width="100%">
          {renderSearchField()}
          {renderFilterButtons()}
        </Stack>
      ) : (
        /* Desktop and tablet view - row layout with responsive behaviors */
        <Box 
          display="flex" 
          flexDirection={isTablet ? "column" : "row"}
          alignItems={isTablet ? "flex-start" : "center"} 
          gap={isTablet ? 2 : 3}
        >
          {renderSearchField()}
          
          {/* Flexible spacer only in desktop view */}
          {!isTablet && <Box sx={{ flexGrow: 1 }} />}
          
          {renderFilterButtons()}
        </Box>
      )}

      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={handleDateMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Date Range
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleDateApply} size="small" sx={applyButtonStyle}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>

      <Menu anchorEl={typeAnchorEl} open={Boolean(typeAnchorEl)} onClose={handleTypeMenuClose}>
        {transactionTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleTypeSelect(type)}
            sx={{
              backgroundColor: selectedTypes.includes(type) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: selectedTypes.includes(type)
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={selectedTypes.includes(type)} onChange={() => {}} color="primary" />}
              label={type}
              sx={{ width: '100%' }}
            />
          </MenuItem>
        ))}
        <Divider />
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            {selectedTypes.length}/2 selected
          </Typography>
          <Button
            size="small"
            onClick={handleClearTypes}
            disabled={selectedTypes.length === 0}
            color="error"
          >
            Clear
          </Button>
        </Box>
      </Menu>

      <Popover
        open={Boolean(amountAnchorEl)}
        anchorEl={amountAnchorEl}
        onClose={handleAmountMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Amount Range
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Min"
                type="number"
                fullWidth
                size="small"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max"
                type="number"
                fullWidth
                size="small"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value === '' ? '' : Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleAmountApply} size="small" sx={applyButtonStyle}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default TransactionFilters;