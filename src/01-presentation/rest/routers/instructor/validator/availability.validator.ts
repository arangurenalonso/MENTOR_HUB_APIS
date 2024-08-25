import messagesValidator from '@domain/helpers/messages-validator';

import { body, param } from 'express-validator';

const AvailabilityValidation = [
  body('availability')
    .isArray()
    .withMessage(messagesValidator.array('availability')),

  body('availability')
    .isArray()
    .withMessage(messagesValidator.array('availability')),

  body('availability')
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage(messagesValidator.notEmptyArray('availability')),

  body('availability.*.id')
    .optional({ nullable: true })
    .isUUID()
    .withMessage(messagesValidator.guid('id')),

  body('availability.*.idDayOfWeek')
    .notEmpty()
    .withMessage(messagesValidator.required('idDayOfWeek'))
    .isUUID()
    .withMessage(messagesValidator.guid('idDayOfWeek')),

  body('availability.*.idStartTime')
    .notEmpty()
    .withMessage(messagesValidator.required('idStartTime'))
    .isUUID()
    .withMessage(messagesValidator.guid('idStartTime')),

  body('availability.*.idFinalTime')
    .notEmpty()
    .withMessage(messagesValidator.required('idFinalTime'))
    .isUUID()
    .withMessage(messagesValidator.guid('idFinalTime')),

  param('idInstructor')
    .notEmpty()
    .withMessage(messagesValidator.required('idInstructor'))
    .isUUID()
    .withMessage(messagesValidator.guid('idInstructor')),
];

export default AvailabilityValidation;
