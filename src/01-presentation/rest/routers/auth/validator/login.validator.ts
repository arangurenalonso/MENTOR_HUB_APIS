import messagesValidator from '@domain/helpers/messages-validator';
import regularExps from '@domain/helpers/regular-exp';

import { body } from 'express-validator';

const LoginValidation = [
  body('email')
    .exists()
    .withMessage(messagesValidator.required('email'))
    .isEmail()
    .withMessage(messagesValidator.emailValid),
  body('password')
    .exists()
    .withMessage(messagesValidator.required('password'))
    .matches(regularExps.passwordLength)
    .withMessage(messagesValidator.passwordLength)
    .matches(regularExps.passwordLowercase)
    .withMessage(messagesValidator.passwordLowercase)
    .matches(regularExps.passwordUppercase)
    .withMessage(messagesValidator.passwordUppercase)
    .matches(regularExps.passwordNumber)
    .withMessage(messagesValidator.passwordNumber)
    .matches(regularExps.passwordSpecialChar)
    .withMessage(messagesValidator.passwordSpecialChar),
];
export default LoginValidation;
