import ErrorResult from '@domain/abstract/result-abstract/error';

class UserErrors {
  static readonly USER_NOT_FOUND: ErrorResult = new ErrorResult(
    'USER.Get',
    'User does not Found',
    404
  );
  static readonly USER_INVALID_EMAIL = (email?: string): ErrorResult => {
    const msg = email
      ? `User Email${email} is not a valid email`
      : `User Email is Required`;

    return new ErrorResult('USER.Email', msg, 400);
  };
  static readonly USER_INVALID_PASSWORD = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'USER.Password',
      `User Password is not valid: ${reasonsMessage}`,
      400
    );
  };

  static readonly USER_INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'USER.ID',
      `User ID${idMessage} is not a valid ID`,
      400
    );
  };
  static readonly USER_NOT_ROLE_PROVIDE = (): ErrorResult => {
    return new ErrorResult(
      'USER.ROLE',
      `'At least one role must be provided.'`,
      400
    );
  };
  static readonly USER_NOT_PASSWORD_PROVIDE = (): ErrorResult => {
    return new ErrorResult('USER.PASSWORD', `Password is required`, 400);
  };
}

export default UserErrors;
