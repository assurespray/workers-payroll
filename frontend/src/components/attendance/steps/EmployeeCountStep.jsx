import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const EmployeeCountStep = ({ count, onChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for deletion
    if (value === '') {
      onChange(1);
      return;
    }
    
    // Parse and validate
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      onChange(num);
    }
  };

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
        label="Number of Employees"
        value={count}
        onChange={handleChange}
        type="text"
        inputProps={{ 
          inputMode: 'numeric',
          pattern: '[0-9]*'
        }}
        helperText="Enter number between 1 and 100"
      />
    </Box>
  );
};

export default EmployeeCountStep;
