import { ErrorResult } from '@domain/abstract/result-abstract';

class PersonErrors {
  static readonly EMAIL_NOT_FOUND = (
    personName: string,
    email: string
  ): ErrorResult => {
    return new ErrorResult(
      'PERSON.EMAIL',
      `The person ${personName} dosen't have the email ${email}`,
      400
    );
  };
  static readonly INVALID_NUMBER_OF_PRIMARY_EMAILS = (
    cantEmailPrimary: number
  ): ErrorResult => {
    return new ErrorResult(
      'PERSON.EMAIL.PRIMARY',
      `There must be exactly one primary email address and got ${cantEmailPrimary}.`,
      400
    );
  };
}

export default PersonErrors;
