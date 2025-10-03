import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const EmployeeCountStep = ({ count, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Number of Workers
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Enter the number of workers sent to this location
      </Typography>

      <TextField
        fullWidth
        type="number"
        label="Number of Employees"
        value={count}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        inputProps={{ min: 1, max: 100 }}
      />
    </Box>
  );
};

export default EmployeeCountStep;
