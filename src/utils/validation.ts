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
        error = value.length < 6 ? 'Password must be at least 6 characters' : '';
      }
      break;

    case 'fullName':
      error = isEmptyValue(value, name);
      break;

    case 'profession':
      error = isEmptyValue(value, name);
      break;
  }

  return error;
};

export const validateEntryFields = (name: string, value: string | number) => {
  let error = '';

  if (typeof value === 'number') value = value.toString();

  switch (name) {
    case 'amount':
      error = isEmptyValue(value, name);
      if (!error) {
        error = parseInt(value) <= 0 ? 'Amount must be greater than 0' : '';
      }
      break;

    case 'date':
      error = isEmptyValue(value, name);
      break;
    case 'type':
      error = isEmptyValue(value, name);
      break;
    case 'category':
      error = isEmptyValue(value, name);
      break;
  }
  return error;
};

export const refactorTextContent = (text: string): string => {
  // Ignore the text '**'
  if (text === '**') {
    return '';
  }
  // Remove the text '****\n\n'
  text = text.replace(/'\*\*\*\*\n\n'/g, '');

  // Ignore the text '**'
  text = text.replace(/\*\*/g, '');

  // Make text inside '**' and ':**' bold
  text = text.replace(/\*\*(.*?)\*\*:/g, '<b>$1</b>:');

  // Correct common errors (example: double spaces)
  text = text.replace(/\s\s+/g, ' ');

  // Standardize formatting (example: capitalize first letter of each sentence)
  text = text.replace(/(^\w|\.\s*\w)/g, (c) => c.toUpperCase());

  // Sanitize input to prevent XSS attacks
  const sanitizeHtml = (str: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
  };
  text = sanitizeHtml(text);

  return text;
};
