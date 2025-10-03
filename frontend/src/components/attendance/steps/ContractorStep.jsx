import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

const ContractorStep = ({ contractors, selectedContractor, onSelect }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 1: Select Contractor
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Choose the contractor for this attendance entry
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Contractor</InputLabel>
        <Select
          value={selectedContractor}
          onChange={(e) => onSelect(e.target.value)}
          label="Contractor"
        >
          {contractors.map((contractor) => (
            <MenuItem key={contractor._id} value={contractor._id}>
              {contractor.name} ({contractor.contractorId})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ContractorStep;
