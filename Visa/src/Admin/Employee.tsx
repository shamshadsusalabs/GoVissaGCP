import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  Typography,
  TablePagination,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface Employee {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  isVerified: boolean;
  visaIds: string[];
  points: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Employee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://govissa-872569311567.asia-south2.run.app/api/employee/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data);
        setFilteredEmployees(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber.includes(searchTerm)
    );
    setFilteredEmployees(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, employees]);

  const handleVerifyEmployee = async (id: string, currentStatus: boolean) => {
    setVerifyingId(id);
    try {
      const response = await fetch(`https://govissa-872569311567.asia-south2.run.app/api/employee/verify/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: !currentStatus // Toggle the current status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to verify employee');
      }

      setEmployees(prev =>
        prev.map(emp =>
          emp._id === id ? { ...emp, isVerified: !currentStatus } : emp
        )
      );
      setFilteredEmployees(prev =>
        prev.map(emp =>
          emp._id === id ? { ...emp, isVerified: !currentStatus } : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify employee');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Employee Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search employees..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.points}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={employee.isVerified}
                      disabled={verifyingId === employee._id}
                      onChange={() => handleVerifyEmployee(employee._id, employee.isVerified)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(employee.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={verifyingId === employee._id}
                      onClick={() => handleVerifyEmployee(employee._id, employee.isVerified)}
                    >
                      {verifyingId === employee._id ? (
                        <CircularProgress size={20} />
                      ) : employee.isVerified ? (
                        'Unverify'
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Employee;