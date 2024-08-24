import { ProviderEnum } from '@domain/user-aggregate/provider/enum/provider.enum';
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
const providerMessage = {
  invalidProviderMessage: (providedValue: string) => {
    const validProviders = Object.values(ProviderEnum).join(', ');
    return `Invalid provider: ${providedValue}. Valid providers are: ${validProviders}.`;
  },
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
  timeZoneInvalidFormat: (value: string) =>
    `The time zone '${value}' must be in the format 'Region/City', where 'Region' and 'City' can only contain letters, underscores, or hyphens. Example: 'America/New_York'.`,
  invalidDayNameFormat: (value: string) =>
    `The day name '${value}' must be one of the following: ${domainRules.dayNameValid.join(
      ', '
    )}.`,
  invalidTimeFormat: (value: string) =>
    `The time '${value}' must be in the format 'HH:mm' or 'HH:mm:ss', where 'HH' is a two-digit hour between 00 and 23, 'mm' is a two-digit minute between 00 and 59, and 'ss' (optional) is a two-digit second between 00 and 59. Example: '14:30' or '14:30:00'.`,
};
const messagesValidator = {
  ...providerMessage,
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
  guidFile: (field: string) => `The field '${field}' must be a GUID.`,
  string: (field: string) => `The field '${field}' must be a string.`,
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
  invalidFormat: (field: string) => `${field} contains invalid characters.`,
  mustBeInteger: (field: string) => `${field} must be an integer.`,
  range: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max}.`,
  array: (field: string) => `El campo '${field}' debe ser un array`,
  object: (field: string) => `${field} is not a valid object.`,
  notEmptyArray: (field: string) =>
    `El campo '${field}' no puede estar vacío y debe contener al menos un elemento`,
  invalidURL: (field: string) => `${field} must be a valid URL.`,
  invalidEnum: (field: string, enumObj: object) => {
    const validValues = Object.values(enumObj).join(', ');
    return `${field} contains an invalid value. Valid values are: ${validValues}.`;
  },
};
export default messagesValidator;
