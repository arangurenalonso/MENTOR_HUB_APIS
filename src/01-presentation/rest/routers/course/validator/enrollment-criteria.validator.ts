import messagesValidator from '@domain/helpers/messages-validator';

import { body, param } from 'express-validator';

const EnrollmentCriteriaValidation = [
  body('requirements')
    .isArray()
    .withMessage(messagesValidator.array('requirements')),

  body('requirements')
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage(messagesValidator.notEmptyArray('requirements')),

  body('requirements.*.id')
    .optional({ nullable: true })
    .isUUID()
    .withMessage(messagesValidator.guid('id')),

  body('requirements.*.description')
    .notEmpty()
    .withMessage(messagesValidator.required('description'))
    .isString()
    .withMessage(messagesValidator.string('description')),

  body('intendedLearners')
    .isArray()
    .withMessage(messagesValidator.array('intendedLearners')),

  body('intendedLearners')
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage(messagesValidator.notEmptyArray('intendedLearners')),

  body('intendedLearners.*.id')
    .optional({ nullable: true })
    .isUUID()
    .withMessage(messagesValidator.guid('id')),

  body('intendedLearners.*.description')
    .notEmpty()
    .withMessage(messagesValidator.required('description'))
    .isString()
    .withMessage(messagesValidator.string('description')),

  body('learningObjectives')
    .isArray()
    .withMessage(messagesValidator.array('learningObjectives')),

  body('learningObjectives')
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage(messagesValidator.notEmptyArray('learningObjectives')),

  body('learningObjectives.*.id')
    .optional({ nullable: true })
    .isUUID()
    .withMessage(messagesValidator.guid('id')),

  body('learningObjectives.*.description')
    .notEmpty()
    .withMessage(messagesValidator.required('description'))
    .isString()
    .withMessage(messagesValidator.string('description')),
];

export default EnrollmentCriteriaValidation;
