import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const EmployeeCountStep = ({ count, onChange }) => {
  const [inputValue, setInputValue] = React.useState(count.toString());

  // Update local input when count prop changes
  React.useEffect(() => {
    setInputValue(count.toString());
  }, [count]);

  const handleChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string temporarily (while user is deleting)
    if (value === '') {
      setInputValue('');
      return;
    }
    
    // Only allow numbers
    if (!/^\d+$/.test(value)) {
      return;
    }
    
    // Update local state immediately for responsive UI
    setInputValue(value);
    
    // Parse and validate for parent component
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    // If empty or invalid on blur, reset to minimum value
    if (inputValue === '' || parseInt(inputValue) < 1) {
      setInputValue('1');
      onChange(1);
    } else {
      const num = parseInt(inputValue);
      if (num > 100) {
        setInputValue('100');
        onChange(100);
      }
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
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{ 
          inputMode: 'numeric',
          pattern: '[0-9]*'
        }}
        helperText="Enter number between 1 and 100"
        placeholder="Enter number"
      />
    </Box>
  );
};

export default EmployeeCountStep;
