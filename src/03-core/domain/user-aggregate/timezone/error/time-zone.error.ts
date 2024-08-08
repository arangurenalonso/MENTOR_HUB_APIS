import { ErrorResult } from '@domain/abstract/result-abstract';

class TimeZoneErrors {
  static readonly INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'TIME_ZONE.ID',
      `Time zone ID${idMessage} is not a valid ID`,
      400
    );
  };

  static readonly INVALID_OFFSET_HOURS = (reasons: string[]): ErrorResult => {
    return new ErrorResult(
      'TIME_ZONE.OFFSET_HOURS',
      `Offset hours is invalid: ${reasons.join(', ')}`,
      400
    );
  };

  static readonly INVALID_OFFSET_MINUTES = (reasons: string[]): ErrorResult => {
    return new ErrorResult(
      'TIME_ZONE.OFFSET_HOURS',
      `Offset minutes is invalid: ${reasons.join(', ')}`,
      400
    );
  };

  static readonly INVALID_TIMEZONE_STRING_ID = (
    reasons: string[]
  ): ErrorResult => {
    return new ErrorResult(
      'TIME_ZONE.TIMEZONE_STRING_ID',
      `Timezone string id is invalid: ${reasons.join(', ')}`,
      400
    );
  };

  static readonly INVALID_DST_FLAG = (value?: boolean): ErrorResult => {
    const valueMessage = value !== undefined ? ` "${value}"` : '';
    return new ErrorResult(
      'TIME_ZONE.DST_FLAG',
      `DST flag${valueMessage} is not valid.`,
      400
    );
  };
}

export default TimeZoneErrors;
