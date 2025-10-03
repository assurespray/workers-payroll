import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Fab,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';
import contractorService from '../../services/contractorService';
import ContractorDialog from './ContractorDialog';
import SiteList from './SiteList';

const ContractorList = () => {
  const [loading, setLoading] = useState(true);
  const [contractors, setContractors] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [openSiteList, setOpenSiteList] = useState(false);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contractorService.getAll();
      setContractors(response.data || []);
    } catch (err) {
      setError(err || 'Failed to load contractors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContractor = () => {
    setSelectedContractor(null);
    setOpenDialog(true);
  };

  const handleViewSites = (contractor) => {
    setSelectedContractor(contractor);
    setOpenSiteList(true);
  };

  const handleDialogClose = (refresh) => {
    setOpenDialog(false);
    setOpenSiteList(false);
    if (refresh) {
      fetchContractors();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contractors
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {contractors.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No contractors found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Click the + button to add your first contractor
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {contractors.map((contractor) => (
            <Grid item xs={12} sm={6} md={4} key={contractor._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {contractor.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ID: {contractor.contractorId}
                  </Typography>
                  {contractor.contactNumber && (
                    <Typography variant="body2" color="textSecondary">
                      Phone: {contractor.contactNumber}
                    </Typography>
                  )}
                  <Box mt={2}>
                    <Chip
                      label={`${contractor.activeSitesCount || 0} Active Sites`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewSites(contractor)}>
                    View Sites
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Total Contractors: {contractors.length}
        </Typography>
      </Box>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddContractor}
      >
        <AddIcon />
      </Fab>

      <ContractorDialog
        open={openDialog}
        onClose={handleDialogClose}
        contractor={selectedContractor}
      />

      <SiteList
        open={openSiteList}
        onClose={handleDialogClose}
        contractor={selectedContractor}
      />
    </Box>
  );
};

export default ContractorList;
