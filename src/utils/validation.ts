export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return isValid ? '' : 'Invalid email.';
};

export const isEmptyValue = (value: string, name: string): string => {
  const check = value === null || value === '' || value === undefined;
  const formattedName = name.replace(/_/g, ' ');

  return check
    ? `${formattedName.charAt(0).toUpperCase() + formattedName.slice(1)} is required`
    : '';
};

export const validateField = (name: string, value: string) => {
  let error = '';

  switch (name) {
    case 'email':
      error = isEmptyValue(value, name);
      if (!error) {
        error = validateEmail(value.toString());
      }
      break;

    case 'password':
      error = isEmptyValue(value, name);
      if (!error) {
        error = value.length < 4 ? 'Password must be at least 4 characters' : '';
      }
      break;
  }

  return error;
};
