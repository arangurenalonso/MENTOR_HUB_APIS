import domainRules from './regular-exp';

const userMessage = {
  emailValid: "It's not a valid email.",
};
const passwordMessage = {
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
  roleDescriptionInvalidFormat: `Role description must start with 'ROLE_' and can only contain letters, numbers, and underscores.`,
};
const socialMediaMessage = {
  socialMediaDescriptionInvalidFormat: `Social Media description can only contain letters, numbers, spaces, and the following punctuation marks: commas, periods, exclamation points, question marks, and hyphens.`,
};
const personMessage = {
  nameInvalidFormat: 'Name can only contain letters and spaces.',
};
const urlMessage = {
  invalidProtocol: (field: string, value: string) =>
    `The field '${field}' with the value '${value}' Invalid protocol.`,
  invalidDomain: (field: string, value: string) =>
    `The field '${field}' with the value '${value}' Invalid domain name.`,
  invalidPath: (field: string, value: string) =>
    `The field '${field}' with the value '${value}' Invalid URL path.`,
  invalidURLFormat: (field: string, value: string) =>
    `The field '${field}' with the value '${value}' invalid URL format.`,
};
const imageValidation = {
  invalidImageFormat: 'Invalid image format.',
  invalidImageSize: 'Image size exceeds the limit of 2MB.',
};
const headingMessage = {
  headingInvalidFormat:
    "Heading can only contain letters, numbers, spaces, and basic punctuation (.,'-).",
};
const invalidFormat = {
  timeZoneInvalidFormat: `The time zone must be in the format 'Region/City', where 'Region' and 'City' can only contain letters, underscores, or hyphens. Example: 'America/New_York'.`,
  invalidDayNameFormat: `The day name must be one of the following: ${domainRules.dayNameValid.join(
    ', '
  )}.`,
  invalidTimeFormat: `The time must be in the format 'HH:mm', where 'HH' is a two-digit hour between 00 and 23, and 'mm' is a two-digit minute between 00 and 59. Example: '14:30'.`,
};
const messagesValidator = {
  ...invalidFormat,
  ...userMessage,
  ...roleMessage,
  ...socialMediaMessage,
  ...passwordMessage,
  ...personMessage,
  ...urlMessage,
  ...imageValidation,
  ...headingMessage,
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
    `The field '${field}' cannot be a future date.`, // Expresión regular para URLs
  invalidURL: (field: string, reasons: string[]) =>
    `The ${field} is invalid URL. ${reasons.join(' ')}`,
  invalidFormat: (field: string) => `${field} contains invalid characters.`,
  mustBeInteger: (field: string) => `${field} must be an integer.`,
  range: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max}.`,
};
export default messagesValidator;
