import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

const SiteStep = ({ sites, selectedSite, onSelect }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 2: Select Work Site
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Choose the work location
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Work Site</InputLabel>
        <Select
          value={selectedSite}
          onChange={(e) => onSelect(e.target.value)}
          label="Work Site"
          disabled={sites.length === 0}
        >
          {sites.map((site) => (
            <MenuItem key={site._id} value={site._id}>
              {site.siteName}
              {site.address && ` - ${site.address}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {sites.length === 0 && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          No active sites found for this contractor. Please add sites first.
        </Typography>
      )}
    </Box>
  );
};

export default SiteStep;
