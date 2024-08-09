import messagesValidator from '@domain/helpers/messages-validator';
import domainRules from '@domain/helpers/regular-exp';
import { body } from 'express-validator';

const RegisterValidation = [
  body('name').exists().withMessage(messagesValidator.required('name')),
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
  body('confirmPassword')
    .exists()
    .withMessage(messagesValidator.required('confirm password'))
    .custom((value, { req }) => {
      if (value !== req.body?.password) {
        throw new Error(messagesValidator.passwordMismatch);
      }
      return true;
    }),

  body('timeZone').exists().withMessage(messagesValidator.required('timeZone')),
];
export default RegisterValidation;
