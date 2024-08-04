import ErrorResult from '@domain/abstract/result-abstract/error';

class AuthApplicationErrors {
  static readonly CREDENTIAL_INCORRECT = new ErrorResult(
    'User.Create',
    'Error while creating user: Incorrect credentials provided',
    400
  );

  static readonly USER_CREATION_ERROR = (details?: string): ErrorResult => {
    const errorMessage = details ? `: ${details}` : '';
    return new ErrorResult(
      'User.Create',
      `Error while creating user${errorMessage}`,
      500
    );
  };
}

export default AuthApplicationErrors;
