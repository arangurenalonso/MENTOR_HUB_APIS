import messagesValidator from '@domain/helpers/messages-validator';

import { body, param } from 'express-validator';

const IdCoursePathParamValidator = [
  param('idCourse')
    .notEmpty()
    .withMessage(messagesValidator.required('idCourse'))
    .isUUID()
    .withMessage(messagesValidator.guid('idCourse')),
];

export default IdCoursePathParamValidator;
