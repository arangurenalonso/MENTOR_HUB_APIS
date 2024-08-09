import messagesValidator from '@domain/helpers/messages-validator';

import { body, param } from 'express-validator';

const AvailabilityValidation = [
  body('*.id')
    .optional({ nullable: true })
    .isUUID()
    .withMessage(messagesValidator.guidFile('idDayOfWeek')),
  body('*.idDayOfWeek')
    .notEmpty()
    .withMessage(messagesValidator.required('idDayOfWeek'))
    .isUUID()
    .withMessage(messagesValidator.guidFile('idDayOfWeek')),
  body('*.idStartTime')
    .notEmpty()
    .withMessage(messagesValidator.required('idStartTime'))
    .isUUID()
    .withMessage(messagesValidator.guidFile('idStartTime')),
  body('*.idFinalTime')
    .notEmpty()
    .withMessage(messagesValidator.required('idFinalTime'))
    .isUUID()
    .withMessage(messagesValidator.guidFile('idFinalTime')),

  param('idInstructor')
    .notEmpty()
    .withMessage(messagesValidator.required('idInstructor'))
    .isUUID()
    .withMessage(messagesValidator.guidFile('idInstructor')),
];

export default AvailabilityValidation;
