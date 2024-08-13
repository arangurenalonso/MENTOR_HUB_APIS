import ErrorResult from '@domain/abstract/result-abstract/error';

class AuthApplicationErrors {
  static readonly CREDENTIAL_INCORRECT = new ErrorResult(
    'USER.CREDENTIAL_INCORRECT',
    'Authentication failed: The credentials provided are incorrect. Please check your email and password and try again.',
    400
  );

  static readonly USER_CREATION_ERROR = (details?: string): ErrorResult => {
    const errorMessage = details ? ` Details: ${details}` : '';
    return new ErrorResult(
      'USER.Create',
      `User creation failed: An unexpected error occurred while trying to create the user.${errorMessage}`,
      500
    );
  };

  static readonly USER_CREATION_WITH_SOCIAL_PROVIDER_ERROR =
    (): ErrorResult => {
      return new ErrorResult(
        'USER.AUTHENTICATION',
        `User authentication failed: The user was created with social media provider and does not have a password. Please authenticate using social media provider`,
        400
      );
    };
}

export default AuthApplicationErrors;
