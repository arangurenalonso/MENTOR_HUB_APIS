import { ErrorResult } from '@domain/abstract/result-abstract';

class EmailErrors {
  static readonly EMAIL_INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'EMAIL.ID',
      `Email ID${idMessage} is not a valid ID`,
      400
    );
  };
  static readonly EMAIL_INVALID_VERIFICATION_TOKEN = (
    id?: string
  ): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'EMAIL.VERIFICATION_TOKEN',
      `Email verification_token  ${idMessage} is not a valid GUID`,
      400
    );
  };
  static readonly EMAIL_INVALID_EMAIL_ADDRESS = (
    reasons: string[]
  ): ErrorResult => {
    return new ErrorResult(
      'EMAIL.NAME',
      `Email Address is invalid: ${reasons.join(', ')}`,
      400
    );
  };
}

export default EmailErrors;
