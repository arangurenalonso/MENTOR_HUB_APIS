import messagesValidator from '@domain/helpers/messages-validator';

import { body } from 'express-validator';

const CourseInformationValidation = [
  body('title')
    .exists()
    .withMessage(messagesValidator.required('title'))
    .notEmpty()
    .withMessage(messagesValidator.required('title'))
    .isString()
    .withMessage(messagesValidator.string('title')),
  body('description')
    .exists()
    .withMessage(messagesValidator.required('description'))
    .notEmpty()
    .withMessage(messagesValidator.required('description'))
    .isJSON()
    .withMessage(messagesValidator.json('description')),
  body('idSubCategory')
    .notEmpty()
    .withMessage(messagesValidator.required('idSubCategory'))
    .isUUID()
    .withMessage(messagesValidator.guid('idSubCategory')),
  body('idLevel')
    .notEmpty()
    .withMessage(messagesValidator.required('idLevel'))
    .isUUID()
    .withMessage(messagesValidator.guid('idLevel')),
];

export default CourseInformationValidation;
