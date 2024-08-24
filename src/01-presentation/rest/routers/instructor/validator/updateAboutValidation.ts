import { body, param } from 'express-validator';
import messagesValidator from '@domain/helpers/messages-validator';

const UpdateAboutValidation = [
  // Validación del parámetro idInstructor
  param('idInstructor')
    .notEmpty()
    .withMessage(messagesValidator.required('idInstructor'))
    .isUUID()
    .withMessage(messagesValidator.guidFile('idInstructor')),

  body('headline')
    .exists()
    .withMessage(messagesValidator.required('headline'))
    .notEmpty()
    .withMessage(messagesValidator.required('headline'))
    .isString()
    .withMessage(messagesValidator.string('headline')),

  body('introduction')
    .exists()
    .withMessage(messagesValidator.required('introduction'))
    .notEmpty()
    .withMessage(messagesValidator.required('introduction'))
    .isString()
    .withMessage(messagesValidator.string('introduction')),

  body('teachingExperience')
    .exists()
    .withMessage(messagesValidator.required('teachingExperience'))
    .notEmpty()
    .withMessage(messagesValidator.required('teachingExperience'))
    .isString()
    .withMessage(messagesValidator.string('teachingExperience')),

  body('motivation')
    .exists()
    .withMessage(messagesValidator.required('motivation'))
    .notEmpty()
    .withMessage(messagesValidator.required('motivation'))
    .isString()
    .withMessage(messagesValidator.string('motivation')),
];

export default UpdateAboutValidation;
