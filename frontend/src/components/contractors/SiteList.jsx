import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import contractorService from '../../services/contractorService';
import SiteDialog from './SiteDialog';

const SiteList = ({ open, onClose, contractor }) => {
  const [openSiteDialog, setOpenSiteDialog] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  if (!contractor) return null;

  const activeSites = contractor.sites?.filter(site => site.isActive) || [];

  const handleAddSite = () => {
    setSelectedSite(null);
    setOpenSiteDialog(true);
  };

  const handleEditSite = (site) => {
    setSelectedSite(site);
    setOpenSiteDialog(true);
  };

  const handleDeleteSite = async (siteId) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await contractorService.deleteSite(contractor._id, siteId);
        onClose(true);
      } catch (err) {
        alert(err || 'Failed to delete site');
      }
    }
  };

  const handleSiteDialogClose = (refresh) => {
    setOpenSiteDialog(false);
    setSelectedSite(null);
    if (refresh) {
      onClose(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Work Sites - {contractor.name}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              onClick={handleAddSite}
            >
              Add Site
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {activeSites.length === 0 ? (
            <Box textAlign="center" py={4}>
              <LocationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="textSecondary">
                No work sites found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click "Add Site" to create the first work location
              </Typography>
            </Box>
          ) : (
            <List>
              {activeSites.map((site, index) => (
                <React.Fragment key={site._id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditSite(site)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteSite(site._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1">
                            {site.siteName}
                          </Typography>
                          <Chip
                            label={format(new Date(site.startDate), 'MMM yyyy')}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          {site.address && (
                            <Typography variant="body2" color="textSecondary">
                              📍 {site.address}
                            </Typography>
                          )}
                          {site.description && (
                            <Typography variant="body2" color="textSecondary">
                              {site.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < activeSites.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <SiteDialog
        open={openSiteDialog}
        onClose={handleSiteDialogClose}
        contractorId={contractor._id}
        site={selectedSite}
      />
    </>
  );
};

export default SiteList;
