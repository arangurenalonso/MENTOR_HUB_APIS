import { body, param } from 'express-validator';
import messagesValidator from '@domain/helpers/messages-validator';

const UpdateAboutValidation = [
  // Validación del parámetro idInstructor
  param('idInstructor')
    .notEmpty()
    .withMessage(messagesValidator.required('idInstructor'))
    .isUUID()
    .withMessage(messagesValidator.guidFile('idInstructor')),

  body('introductionText')
    .exists()
    .withMessage(messagesValidator.required('introductionText'))
    .notEmpty()
    .withMessage(messagesValidator.required('introductionText'))
    .isString()
    .withMessage(messagesValidator.string('introductionText')),

  body('teachingExperienceText')
    .exists()
    .withMessage(messagesValidator.required('teachingExperienceText'))
    .notEmpty()
    .withMessage(messagesValidator.required('teachingExperienceText'))
    .isString()
    .withMessage(messagesValidator.string('teachingExperienceText')),

  body('motivationText')
    .exists()
    .withMessage(messagesValidator.required('motivationText'))
    .notEmpty()
    .withMessage(messagesValidator.required('motivationText'))
    .isString()
    .withMessage(messagesValidator.string('motivationText')),
];

export default UpdateAboutValidation;
