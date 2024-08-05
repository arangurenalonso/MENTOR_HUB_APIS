import { ErrorResult } from '@domain/abstract/result-abstract';

class InstructorDomainErrors {
  static readonly INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'PERSON.ID',
      `Person ID ${idMessage} is not a valid ID`,
      400
    );
  };

  static readonly INVALID_URL = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'INSTRUCTOR.URL',
      `Instructor url is not valid: ${reasonsMessage}`,
      400
    );
  };

  static readonly INVALID_HEADING = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'INSTRUCTOR.HEADING',
      `Instructor heading is not valid: ${reasonsMessage}`,
      400
    );
  };
}

export default InstructorDomainErrors;
