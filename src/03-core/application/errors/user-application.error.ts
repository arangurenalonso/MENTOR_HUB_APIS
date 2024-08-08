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
  static readonly USER_NOT_FOUND = (value: string) => {
    return new ErrorResult(
      'User.NotFound',
      `User with id '${value}' not found`,
      404
    );
  };
  static readonly USER_TIMEZONE_NOT_FOUND = (value: string) => {
    return new ErrorResult(
      'User.TimeZoneNotFound',
      `TimeZone with id '${value}' not found`,
      404
    );
  };
}

export default UserApplicationErrors;
