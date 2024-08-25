import { body, param } from 'express-validator';
import messagesValidator from '@domain/helpers/messages-validator';
import { ProviderEnum } from '@domain/user-aggregate/provider/enum/provider.enum';

const GoogleSignUpValidation = [
  param('provider')
    .exists()
    .withMessage(messagesValidator.required('provider'))
    .isIn(Object.values(ProviderEnum))
    .withMessage(messagesValidator.invalidEnum(ProviderEnum, 'provider')),
  body('name').exists().withMessage(messagesValidator.required('name')),
  body('email')
    .exists()
    .withMessage(messagesValidator.required('email'))
    .isEmail()
    .withMessage(messagesValidator.emailValid),
  body('photoURL')
    .optional()
    .isURL()
    .withMessage(messagesValidator.invalidURL('photoURL')),
  body('uid').exists().withMessage(messagesValidator.required('uid')),
  body('timeZone').exists().withMessage(messagesValidator.required('timeZone')),
];

export default GoogleSignUpValidation;
