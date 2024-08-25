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
  required: (field?: string) =>
    field ? `The field '${field}' is required.` : `This field is required.`,
  guid: (field?: string) =>
    field
      ? `The field '${field}' must be a GUID.`
      : `This field must be a GUID.`,
  string: (field?: string) =>
    field
      ? `The field '${field}' must be a string.`
      : `This field must be a string.`,
  minLength: (min: number, field?: string) =>
    field
      ? `${field} must be at least ${min} characters long.`
      : `This field must be at least ${min} characters long.`,
  maxLength: (max: number, field?: string) =>
    field
      ? `${field} must not exceed ${max} characters.`
      : `This field must not exceed ${max} characters.`,
  empty: (field?: string) =>
    field
      ? `${field} cannot be null or empty.`
      : `This field cannot be null or empty.`,
  blankSpace: (field?: string) =>
    field
      ? `${field} cannot contain blank spaces.`
      : `This field cannot contain blank spaces.`,
  invalidDateFormat: (field?: string) =>
    field
      ? `The field '${field}' must be a valid date.`
      : `This field must be a valid date.`,
  dateInFuture: (field?: string) =>
    field
      ? `The field '${field}' cannot be a future date.`
      : `This field cannot be a future date.`,
  invalidFormat: (field?: string) =>
    field
      ? `${field} contains invalid characters.`
      : `This field contains invalid characters.`,
  mustBeInteger: (field?: string) =>
    field ? `${field} must be an integer.` : `This field must be an integer.`,
  range: (min: number, max: number, field?: string) =>
    field
      ? `${field} must be between ${min} and ${max}.`
      : `This field must be between ${min} and ${max}.`,
  array: (field?: string) =>
    field
      ? `The field '${field}' must be an array.`
      : `This field must be an array.`,
  object: (field?: string) =>
    field ? `${field} is not a valid object.` : `This is not a valid object.`,
  notEmptyArray: (field?: string) =>
    field
      ? `The field '${field}' cannot be empty and must contain at least one element.`
      : `This field cannot be empty and must contain at least one element.`,
  invalidURL: (field?: string) =>
    field ? `${field} must be a valid URL.` : `This field must be a valid URL.`,
  invalidEnum: (enumObj: object, field?: string) => {
    const validValues = Object.values(enumObj).join(', ');
    return field
      ? `${field} contains an invalid value. Valid values are: ${validValues}.`
      : `This field contains an invalid value. Valid values are: ${validValues}.`;
  },
};
export default messagesValidator;
