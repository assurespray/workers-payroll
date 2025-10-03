// API Base URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

// Date formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

// Shift types - UPDATED with "One and Half"
export const SHIFT_TYPES = [
  { value: 'half', label: 'Half Day (0.5)', multiplier: 0.5 },
  { value: 'full', label: 'Full Day (1.0)', multiplier: 1.0 },
  { value: 'onehalf', label: 'One and Half (1.5)', multiplier: 1.5 },  // ← NEW
  { value: 'double', label: 'Double Shift (2.0)', multiplier: 2.0 },
];

// Shift colors
export const SHIFT_COLORS = {
  half: '#ff9800',
  full: '#4caf50',
  onehalf: '#9c27b0',   // Purple - NEW
  double: '#2196f3',
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  phone: /^[0-9]{10}$/,
  aadhar: /^[0-9]{12}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
};

// Table pagination defaults
export const TABLE_ROWS_PER_PAGE = [10, 25, 50, 100];
export const DEFAULT_ROWS_PER_PAGE = 25;
