const userValidation = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  username: /^(?![_\.])(?!.*[_\.]{2})[a-zA-Z0-9_.]{5,30}(?<![_\.])$/,
};
const passwordRules = {
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  passwordLength: /^.{6,}$/, // Al menos 6 caracteres
  passwordLowercase: /(?=.*[a-z])/, // Al menos una letra minúscula
  passwordUppercase: /(?=.*[A-Z])/, // Al menos una letra mayúscula
  passwordNumber: /(?=.*\d)/, // Al menos un número
  passwordSpecialChar: /(?=.*[@$!%*?&])/, // Al menos un carácter especial

  bcryptHash: /^\$2[abyx]\$\d{2}\$[./A-Za-z0-9]{53}$/, // Bcrypt hash pattern
};
const httpURLRule = {
  protocolRegex: /^(https?:\/\/)/,
  domainRegex: /^([\w\-])+(\.[\w\-]+)+$/,
  pathRegex: /[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]*$/,
};
const imageRule = {
  imageExtension: /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i,
};
const roleRule = {
  roleDescription: /^ROLE_[A-Z0-9_]+$/, // Empieza con ROLE_ y luego letras en mayúsculas, números y guiones bajos
  roleDescriptionMinLength: 8, // ROLE_ + al menos 3 caracteres más
  roleDescriptionMaxLength: 255,
};
const socialMediaRole = {
  socialMediaDescription: /^[a-zA-Z0-9\s,.!?-]+$/,
  socialMediaDescriptionMinLength: 1,
  socialMediaDescriptionMaxLength: 100,
};
const personRule = {
  personNameValid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, // Solo permite letras mayúsculas, minúsculas y letras con tildes
  personNameMinLength: 2,
  personNameMaxLength: 255,
};
const headingRule = {
  headingValid: /^[a-zA-Z0-9\s,.'-]{1,60}$/, // Ajusta esto según tus necesidades
  headingMinLength: 1,
  headingMaxLength: 60,
};
const aboutMeRule = {
  aboutMeMaxLength: 600,
};
const textRule = {
  textValid: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.,:;?!¡¿(){}\[\]\-_"&$%@#\/\\]+$/, // Permite letras, números, espacios y puntuaciones comunes
  timeZoneRegex: /^[A-Za-z]+(?:\/[A-Za-z_-]+)+$/,
};
const minuteRule = {
  minMinuteValid: 0,
  maxMinuteValid: 59,
};
const hoursOffSetRules = {
  minHoursOffSetValid: -12,
  maxHoursOffSetValid: 14,
};
const dateIndexRule = {
  minDateIndexValid: 0,
  maxDateIndexValid: 6,
};
const timeOptionRule = {
  minTimeOptionValid: 0,
  maxTimeOptionValid: 49,
  timeValidation: /^([01]\d|2[0-3]):([0-5]\d)$/,
};
const dateRules = {
  dayNameValid: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
};

const domainRules = {
  ...timeOptionRule,
  ...dateRules,
  ...dateIndexRule,
  ...minuteRule,
  ...hoursOffSetRules,
  ...headingRule,
  ...socialMediaRole,
  ...userValidation,
  ...passwordRules,
  ...roleRule,
  ...personRule,
  ...httpURLRule,
  ...imageRule,
  ...textRule,
  ...aboutMeRule,
  blankSpace: /\s/,
};
export default domainRules;
