const userValidation = {
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  passwordLength: /^.{6,}$/, // Al menos 6 caracteres
  passwordLowercase: /(?=.*[a-z])/, // Al menos una letra minúscula
  passwordUppercase: /(?=.*[A-Z])/, // Al menos una letra mayúscula
  passwordNumber: /(?=.*\d)/, // Al menos un número
  passwordSpecialChar: /(?=.*[@$!%*?&])/, // Al menos un carácter especial

  bcryptHash: /^\$2[abyx]\$\d{2}\$[./A-Za-z0-9]{53}$/, // Bcrypt hash pattern
  username: /^(?![_\.])(?!.*[_\.]{2})[a-zA-Z0-9_.]{5,30}(?<![_\.])$/,
};
const roleValidation = {
  roleDescription: /^ROLE_[A-Z0-9_]+$/, // Empieza con ROLE_ y luego letras en mayúsculas, números y guiones bajos
  roleDescriptionMinLength: 8, // ROLE_ + al menos 3 caracteres más
  roleDescriptionMaxLength: 255,
};
const personValidation = {
  nameValid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, // Solo permite letras mayúsculas, minúsculas y letras con tildes
  nameMinLength: 2,
  nameMaxLength: 255,
};
const regularExps = {
  ...userValidation,
  ...roleValidation,
  ...personValidation,
  blankSpace: /\s/,
};
export default regularExps;
