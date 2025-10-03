import { VALIDATION_PATTERNS } from './constants';

export const validators = {
  // Validate phone number
  phone: (value) => {
    if (!value) return 'Phone number is required';
    if (!VALIDATION_PATTERNS.phone.test(value)) {
      return 'Phone number must be exactly 10 digits';
    }
    return null;
  },

  // Validate Aadhar number
  aadhar: (value) => {
    if (!value) return 'Aadhar number is required';
    if (!VALIDATION_PATTERNS.aadhar.test(value)) {
      return 'Aadhar number must be exactly 12 digits';
    }
    return null;
  },

  // Validate IFSC code
  ifsc: (value) => {
    if (!value) return null; // Optional field
    if (!VALIDATION_PATTERNS.ifsc.test(value)) {
      return 'Invalid IFSC code format';
    }
    return null;
  },

  // Validate email
  email: (value) => {
    if (!value) return 'Email is required';
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(value)) {
      return 'Please provide a valid email';
    }
    return null;
  },

  // Validate required field
  required: (value, fieldName = 'This field') => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Validate number
  number: (value, min = null, max = null) => {
    if (isNaN(value)) return 'Must be a valid number';
    if (min !== null && value < min) return `Must be at least ${min}`;
    if (max !== null && value > max) return `Must be at most ${max}`;
    return null;
  },
};

export default validators;
