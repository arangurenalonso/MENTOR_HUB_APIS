import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';

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
    .matches(domainRules.passwordLength)
    .withMessage(messagesValidator.passwordLength)
    .matches(domainRules.passwordLowercase)
    .withMessage(messagesValidator.passwordLowercase)
    .matches(domainRules.passwordUppercase)
    .withMessage(messagesValidator.passwordUppercase)
    .matches(domainRules.passwordNumber)
    .withMessage(messagesValidator.passwordNumber)
    .matches(domainRules.passwordSpecialChar)
    .withMessage(messagesValidator.passwordSpecialChar),
];
export default LoginValidation;
