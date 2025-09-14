import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Define types for our data
interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  email: string;
  phone: string;
  selectedDate: string;
  travellers: number;
  createdAt: number;
  paidAt?: string;
  paymentId?: string;
}

interface User {
  phoneNumber: string;
  // Add other user properties if needed
}

const StatusChip = styled(Chip)(() => ({
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.7rem',
}));

const BillList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Get phone number from local storage
  const getPhoneNumber = (): string => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      throw new Error('User not found in local storage');
    }
    const user: User = JSON.parse(userString);
    return user.phoneNumber;
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const phoneNumber = getPhoneNumber();
        const response = await fetch(`http://localhost:5000/api/payments/by-phone/${phoneNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleInvoiceClick = (payment: Payment) => {
    // Navigate to /bill with payment data as state
    navigate('/user-dashboard/bill', { state: { payment } });
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (dateString: string | number) => {
    if (typeof dateString === 'number') {
      return new Date(dateString * 1000).toLocaleString();
    }
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is in paisa
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'created':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Payment History
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Search Payments"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as string)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Travellers</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>{payment.travellers}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleInvoiceClick(payment)}
                      disabled={payment.status !== 'paid'}
                    >
                      Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">No payments found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPayments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </Paper>
  );
};

export default BillList;