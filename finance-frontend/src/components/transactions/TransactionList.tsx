import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, IconButton, Tooltip, Typography, Pagination, Select, MenuItem
} from '@mui/material';
import { EditOutlined, DeleteOutlined, Sort } from '@mui/icons-material';
import { Transaction } from '../../types/transaction.types';
import { useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material';
import DeleteTransactionModal from './DeleteTransactionModal';


interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

type SortField = 'amount' | 'date' | 'type' | 'category' | 'notes' | null;
type SortDirection = 'asc' | 'desc' | null;

const TransactionList: React.FC<TransactionListProps> = ({ transactions: initialTransactions, onEdit, onDelete }) => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);


  // Update local transactions when prop changes
  useEffect(() => {
    setTransactions(initialTransactions);
    // If external data changes, reset sort to maintain consistency
    setSortField(null);
    setSortDirection(null);
  }, [initialTransactions]);

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection;
    
    // If clicking on a new field, start with ascending
    if (sortField !== field) {
      newDirection = 'asc';
      setSortField(field);
    } else {
      // If clicking on the same field, cycle through states
      if (sortDirection === null) {
        newDirection = 'asc';
      } else if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = null;
        setSortField(null);
      }
    }
    
    setSortDirection(newDirection);
    
    if (newDirection === null) {
      // Reset to original order
      setTransactions([...initialTransactions]);
    } else {
      // Sort by the selected field
      const sortedTransactions = [...initialTransactions].sort((a, b) => {
        if (field === 'amount') {
          const amountA = Number(a.amount);
          const amountB = Number(b.amount);
          return newDirection === 'asc' ? amountA - amountB : amountB - amountA;
        } else if (field === 'date') {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (field === 'type') {
          const typeA = a.type.toLowerCase();
          const typeB = b.type.toLowerCase();
          return newDirection === 'asc' 
            ? typeA.localeCompare(typeB)
            : typeB.localeCompare(typeA);
        } else if (field === 'category') {
          const categoryA = a.category.toLowerCase();
          const categoryB = b.category.toLowerCase();
          return newDirection === 'asc' 
            ? categoryA.localeCompare(categoryB)
            : categoryB.localeCompare(categoryA);
        } else if (field === 'notes') {
          const notesA = (a.notes || '').toLowerCase();
          const notesB = (b.notes || '').toLowerCase();
          return newDirection === 'asc' 
            ? notesA.localeCompare(notesB)
            : notesB.localeCompare(notesA);
        }
        return 0;
      });
      
      setTransactions(sortedTransactions);
    }
    
    setPage(0); // Reset to first page after changing sort
  };

  const pageCount = Math.ceil(transactions.length / rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => { 
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, transactions.length);

  const paginatedTransactions = transactions.slice(start - 1, end);

  const [hoveredEdit, setHoveredEdit] = useState<string | null>(null);
  const [hoveredDelete, setHoveredDelete] = useState<string | null>(null);

  const renderPaginationBar = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      {/* Left */}
      <Typography variant="caption" sx={{ minWidth: 140, color: 'secondary.dark', fontWeight:600 }}>
        Showing {start}–{end} of {transactions.length}
      </Typography>

      {/* Center */}
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={handleChangePage}
        color="primary"
        size="small"
        sx={{
          '& .MuiPaginationItem-root': {
            backgroundColor: 'transparent',
            color: theme.palette.text.secondary, 
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'transparent', 
              color: theme.palette.primary.main, 
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent',
              color: theme.palette.primary.main, 
              '&:hover': {
              backgroundColor: 'transparent' 
              }
            },
          },
          '& .MuiPaginationItem-ellipsis': {
            color: theme.palette.text.secondary,
          }
        }}
      />

      {/* Right */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{color: 'secondary.dark', fontWeight:600 }}>Rows per page:</Typography>
        <Select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          size="small"
          sx={{ fontSize: '0.8rem' }} 
        >
          {[3, 5, 10, 15, 20].map((val) => (
            <MenuItem key={val} value={val}>{val}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );

  // Helper function to create sortable column header
  const renderSortableHeader = (title: string, field: SortField) => {
    const isActiveSort = sortField === field;
    const currentDirection = isActiveSort ? sortDirection : null;
    
    const getSortTooltip = () => {
      if (!isActiveSort || currentDirection === null) {
        return `Sort by ${title.toLowerCase()} (A to Z)`;
      } else if (currentDirection === 'asc') {
        return `Sort by ${title.toLowerCase()} (Z to A)`;
      } else {
        return `Clear ${title.toLowerCase()} sorting`;
      }
    };
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {title}
        <Tooltip title={getSortTooltip()}>
          <IconButton
            size="small"
            onClick={() => handleSort(field)}
            sx={{ ml: 0.5 }}
          >
            <Sort 
              fontSize="small" 
              sx={{ 
                color: isActiveSort ? theme.palette.primary.main : 'text.disabled',
                transform: currentDirection === 'desc' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s, color 0.2s'
              }} 
            />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Paper sx={{ mt: 2, mb: 6, borderRadius: 2, overflow: 'hidden' }}>
      {renderPaginationBar()}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{
              backgroundColor: '#F9F9F9',
              '& .MuiTableCell-root': {
                color: 'text.secondary',
                fontWeight: 600,
              },
            }}>
              <TableCell>{renderSortableHeader('Type', 'type')}</TableCell>
              <TableCell>{renderSortableHeader('Category', 'category')}</TableCell>
              <TableCell>{renderSortableHeader('Amount', 'amount')}</TableCell>
              <TableCell>{renderSortableHeader('Date', 'date')}</TableCell>
              <TableCell>{renderSortableHeader('Notes', 'notes')}</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Box
                    sx={{
                      bgcolor: transaction.type === 'Income'
                        ? theme.palette.success.light
                        : transaction.type === 'Expense'
                        ? theme.palette.error.light
                        : theme.palette.warning.light,
                      color: transaction.type === 'Income'
                        ? theme.palette.success.main
                        : transaction.type === 'Expense'
                        ? theme.palette.error.main
                        : theme.palette.warning.main,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'inline-block',
                      textAlign: 'center',
                    }}
                  >
                    {transaction.type}
                  </Box>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>${Number(transaction.amount).toFixed(2)}</TableCell>
                <TableCell>{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No Date'}</TableCell>
                <TableCell>{transaction.notes || 'No notes'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      size="small"
                      sx={{
                        mr: 1,
                        color: hoveredEdit === transaction.id ? theme.palette.primary.main : 'grey.500',
                        transition: 'color 0.2s'
                      }}
                      onClick={() => onEdit(transaction)}
                      onMouseEnter={() => setHoveredEdit(transaction.id)}
                      onMouseLeave={() => setHoveredEdit(null)}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      size="small"
                      sx={{
                        color: hoveredDelete === transaction.id ? theme.palette.error.main : 'grey.500',
                        transition: 'color 0.2s'
                      }}
                      onClick={() => {
                        setTransactionToDelete(transaction);
                        setDeleteModalOpen(true);
                      }}              
                      onMouseEnter={() => setHoveredDelete(transaction.id)}
                      onMouseLeave={() => setHoveredDelete(null)}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

        <DeleteTransactionModal
        open={deleteModalOpen}
        transaction={transactionToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (transactionToDelete) {
            onDelete(transactionToDelete.id);
            setDeleteModalOpen(false);
          }
        }}
      />
      
      {renderPaginationBar()}
    </Paper>
    
  );


};

export default TransactionList;