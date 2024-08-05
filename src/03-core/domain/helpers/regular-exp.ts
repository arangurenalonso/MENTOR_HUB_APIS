const userValidation = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  username: /^(?![_\.])(?!.*[_\.]{2})[a-zA-Z0-9_.]{5,30}(?<![_\.])$/,
};
const passwordValidation = {
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  passwordLength: /^.{6,}$/, // Al menos 6 caracteres
  passwordLowercase: /(?=.*[a-z])/, // Al menos una letra minúscula
  passwordUppercase: /(?=.*[A-Z])/, // Al menos una letra mayúscula
  passwordNumber: /(?=.*\d)/, // Al menos un número
  passwordSpecialChar: /(?=.*[@$!%*?&])/, // Al menos un carácter especial

  bcryptHash: /^\$2[abyx]\$\d{2}\$[./A-Za-z0-9]{53}$/, // Bcrypt hash pattern
};
const httpValidation = {
  protocolRegex: /^(https?:\/\/)/,
  domainRegex: /^([\w\-])+(\.[\w\-]+)+$/,
  pathRegex: /[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]*$/,
};
const image = {
  imageExtension: /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i,
};
const roleValidation = {
  roleDescription: /^ROLE_[A-Z0-9_]+$/, // Empieza con ROLE_ y luego letras en mayúsculas, números y guiones bajos
  roleDescriptionMinLength: 8, // ROLE_ + al menos 3 caracteres más
  roleDescriptionMaxLength: 255,
};
const socialMediaValidation = {
  socialMediaDescription: /^[a-zA-Z0-9\s,.!?-]+$/,
  socialMediaDescriptionMinLength: 1,
  socialMediaDescriptionMaxLength: 100,
};
const personValidation = {
  nameValid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, // Solo permite letras mayúsculas, minúsculas y letras con tildes
  nameMinLength: 2,
  nameMaxLength: 255,
};
const headingValidation = {
  headingValid: /^[a-zA-Z0-9\s,.'-]{1,60}$/, // Ajusta esto según tus necesidades
  headingMinLength: 1,
  headingMaxLength: 60,
};
const aboutMeValidation = {
  aboutMeMaxLength: 600,
};
const textValidation = {
  textValid: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.,:;?!¡¿(){}\[\]\-_"&$%@#\/\\]+$/, // Permite letras, números, espacios y puntuaciones comunes
};
const regularExps = {
  ...headingValidation,
  ...socialMediaValidation,
  ...userValidation,
  ...passwordValidation,
  ...roleValidation,
  ...personValidation,
  ...httpValidation,
  ...image,
  ...textValidation,
  ...aboutMeValidation,
  blankSpace: /\s/,
};
export default regularExps;
