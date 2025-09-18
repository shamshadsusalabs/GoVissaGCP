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
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

interface CountryDetails {
  code: string;
  name: string;
  embassyLocation: string;
  generalRequirements: string;
}

interface VisaType {
  id: string;
  name: string;
  category: string;
  code: string;
  entries: string;
  biometricRequired: boolean;
  interviewRequired: boolean;
  processingMethod: string;
  processingTime: string;
  stayDuration: string;
  validity: string;
  visaFee: number;
  currency: string;
  serviceFee: number;
  notes: string;
}

interface Document {
  id: string;
  name: string;
  description: string;
  format: string;
  example: string;
  isMandatory: boolean;
}

interface RejectionReason {
  id: string;
  reason: string;
  description: string;
  frequency: string;
}

interface VisaConfiguration {
  _id: string;
  continent: string;
  countryDetails: CountryDetails;
  visaTypes: VisaType[];
  documents: Document[];
  eligibility: string;
  images: string[];
  rejectionReasons: RejectionReason[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const VisaConfigList: React.FC = () => {
  const navigate = useNavigate();
  const [configurations, setConfigurations] = useState<VisaConfiguration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [continentFilter, setContinentFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://govisaa-872569311567.asia-south2.run.app/api/configurations/getAll');
      
      if (!response.ok) {
        throw new Error('Failed to fetch configurations');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConfigurations(data.data);
      } else {
        setError('Failed to fetch configurations');
      }
    } catch (err) {
      setError('Error fetching configurations');
      console.error('Error fetching configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!configToDelete) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/configurations/delete/${configToDelete}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }
      
      setConfigurations(configurations.filter(config => config._id !== configToDelete));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Error deleting configuration');
      console.error('Error deleting configuration:', err);
    } finally {
      setLoading(false);
      setConfigToDelete(null);
    }
  };

  const handleUpdate = (id: string) => {
    navigate(`/dashboard/visa-config-form-update/${id}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleContinentFilterChange = (event: any) => {
    setContinentFilter(event.target.value as string);
    setPage(0);
  };

  const filteredConfigurations = configurations.filter(config => {
    // ✅ Add null checks for countryDetails
    if (!config.countryDetails) {
      return false; // Skip configurations without countryDetails
    }
    
    const matchesSearch = config.countryDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.countryDetails.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = continentFilter === 'all' || config.continent === continentFilter;
    return matchesSearch && matchesContinent;
  });

  const continents = [...new Set(configurations.map(config => config.continent))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visa Configurations
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search by Country"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Continent</InputLabel>
          <Select
            value={continentFilter}
            label="Continent"
            onChange={handleContinentFilterChange}
          >
            <MenuItem value="all">All Continents</MenuItem>
            {continents.map(continent => (
              <MenuItem key={continent} value={continent}>{continent}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Continent</TableCell>
                  <TableCell>Embassy Location</TableCell>
                  <TableCell>Visa Types</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConfigurations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((config) => (
                    <TableRow key={config._id}>
                      <TableCell>{config.countryDetails?.name || 'N/A'}</TableCell>
                      <TableCell>{config.countryDetails?.code || 'N/A'}</TableCell>
                      <TableCell>{config.continent || 'N/A'}</TableCell>
                      <TableCell>{config.countryDetails?.embassyLocation || 'N/A'}</TableCell>
                      <TableCell>
                        {config.visaTypes?.map((type) => (
                          <div key={type.id}>
                            {type.name} ({type.category})
                          </div>
                        )) || 'No visa types'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleUpdate(config._id)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setConfigToDelete(config._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredConfigurations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Configuration</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this visa configuration?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VisaConfigList;