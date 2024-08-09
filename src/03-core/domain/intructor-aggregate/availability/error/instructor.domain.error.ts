import { ErrorResult } from '@domain/abstract/result-abstract';

class InstructorAvailabilityDomainErrors {
  static readonly INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'INSTRUCTOR_AVAILABILITY.ID',
      `Instructor Availavility ID ${idMessage} is not a valid ID`,
      400
    );
  };

  static readonly INVALID_TIME_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'INSTRUCTOR_AVAILABILITY.TIME_ID',
      `Instructor Availavility TIME ID ${idMessage} is not a valid ID`,
      400
    );
  };

  static readonly INVALID_DAY_OF_WEEK_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'INSTRUCTOR_AVAILABILITY.DAY_OF_WEEK',
      `Instructor Availavility Day of Week ID ${idMessage} is not a valid ID`,
      400
    );
  };

  static readonly INVALID_DATE_NAME = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'INSTRUCTOR_AVAILAVILITY.DATE_NAME',
      `Instructor Availability date name is not valid: ${reasonsMessage}`,
      400
    );
  };

  static readonly INVALID_DATE_INDEX = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'INSTRUCTOR_AVAILAVILITY.DATE_INDEX',
      `Instructor Availability date index is not valid: ${reasonsMessage}`,
      400
    );
  };

  static readonly INVALID_TIME_VALUE = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'INSTRUCTOR_AVAILAVILITY.TIME_VALUE',
      `Instructor Availability Time Value is not valid: ${reasonsMessage}`,
      400
    );
  };

  static readonly DATE_NAME_INDEX_MISMATCH = (
    dayName: string,
    dayIndex: number
  ): ErrorResult => {
    return new ErrorResult(
      'INSTRUCTOR_AVAILABILITY.DATE_NAME_INDEX_MISMATCH',
      `The day name "${dayName}" does not match the expected name for index ${dayIndex}`,
      400
    );
  };

  static readonly START_TIME_GREATER_OR_EQUAL_FINAL_TIME = (
    startTime: string,
    finalTime: string
  ): ErrorResult => {
    return new ErrorResult(
      'INSTRUCTOR_AVAILABILITY.INVALID_TIME_RANGE',
      `The start time (${startTime}) cannot be greater than or equal to the final time (${finalTime}).`,
      400
    );
  };

  static readonly OVERLAPPING_TIME = (
    dayName: string,
    startTime1: string,
    finalTime1: string,
    startTime2: string,
    finalTime2: string
  ): ErrorResult => {
    return new ErrorResult(
      'INSTRUCTOR_AVAILABILITY.OVERLAPPING_TIME',
      `The availability on ${dayName} from ${startTime1} to ${finalTime1} overlaps with another availability from ${startTime2} to ${finalTime2}.`,
      400
    );
  };
}

export default InstructorAvailabilityDomainErrors;
