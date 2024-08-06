import ErrorResult from '@domain/abstract/result-abstract/error';

class InstructorApplicationErrors {
  static readonly ALREADY_EXISTS = (value: string): ErrorResult => {
    return new ErrorResult(
      'INSTRUCTOR.Exist',
      `Instructor '${value}' already exists`,
      400
    );
  };

  static readonly CREATE_ERROR = (error: string): ErrorResult => {
    return new ErrorResult(
      'INSTRUCTOR.Create',
      `Error while Instructor create:  ${error}`,
      500
    );
  };
}

export default InstructorApplicationErrors;
