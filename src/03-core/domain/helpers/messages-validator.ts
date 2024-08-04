const userMessage = {
  emailValid: "It's not a valid email.",
  passwordRequirements:
    'The password must be at least 6 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character.',
  passwordMismatch: 'Passwords do not match.',
  passwordLength: 'The password must be at least 6 characters long.',
  passwordLowercase: 'The password must contain at least one lowercase letter.',
  passwordUppercase: 'The password must contain at least one uppercase letter.',
  passwordNumber: 'The password must contain at least one number.',
  passwordSpecialChar:
    'Password must contain at least one special character (e.g., @$!%*?&).',
  invalidHash: 'The provided value is not a valid bcrypt hash.',
};
const roleMessage = {
  descriptionInvalidFormat: `Role description must start with 'ROLE_' and can only contain letters, numbers, and underscores.`,
};
const personValidation = {
  nameInvalidFormat: 'Name can only contain letters and spaces.',
};
const messagesValidator = {
  ...userMessage,
  ...roleMessage,
  ...personValidation,
  required: (field: string) => `The field '${field}' is required.`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters long.`,
  maxLength: (field: string, max: number) =>
    `${field} must not exceed ${max} characters.`,
  empty: (field: string) => `${field} cannot be null or empty.`,
  blankSpace: (field: string) => `${field} cannot contain blank spaces.`,
  invalidDateFormat: (field: string) =>
    `The field '${field}' must be a valid date.`,
  dateInFuture: (field: string) =>
    `The field '${field}' cannot be a future date.`,
};
export default messagesValidator;
