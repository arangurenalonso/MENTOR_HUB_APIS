import ErrorResult from '@domain/abstract/result-abstract/error';

class UserApplicationErrors {
  static readonly USER_CREATE_ERROR = (error: string): ErrorResult => {
    return new ErrorResult(
      'User.Create',
      `Error while User create:  ${error}`,
      500
    );
  };

  static readonly USER_ALREADY_EXISTS = (
    type: 'username' | 'email',
    value: string
  ): ErrorResult => {
    return new ErrorResult(
      'User.Exist',
      `User with ${
        type.charAt(0).toUpperCase() + type.slice(1)
      } '${value}' already exists`,
      400
    );
  };
}

export default UserApplicationErrors;
