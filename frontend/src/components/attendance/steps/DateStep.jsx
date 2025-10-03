import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const DateStep = ({ date, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 5: Select Date
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Choose the date for this attendance
      </Typography>

      <TextField
        fullWidth
        type="date"
        label="Date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

export default DateStep;
