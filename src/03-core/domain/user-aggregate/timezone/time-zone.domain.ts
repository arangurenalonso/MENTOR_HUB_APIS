import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import TimeZoneId from './value-object/time-zone-id.value-object';
import OffsetMinutes from './value-object/offset-minutes.value-object';
import OffsetHours from './value-object/offset-hours.value-object';
import TimeZoneStringId from './value-object/time-zone-string-id.value-object';

export type TimeZoneDomainProperties = {
  id: string;
  offsetMinutes: number;
  offsetHours: number;
  timeZoneStringId: string;
  description: string;
  isDaylightSavingTime: boolean;
};
export type TimeZoneDomainArgs = {
  id?: string;
  offsetMinutes: number;
  offsetHours: number;
  timeZoneStringId: string;
  isDaylightSavingTime: boolean;
};

type TimeZoneDomainConstructor = {
  id: TimeZoneId;
  offsetMinutes: OffsetMinutes;
  offsetHours: OffsetHours;
  timeZoneStringId: TimeZoneStringId;
  isDaylightSavingTime: boolean;
};

class TimeZoneDomain extends BaseDomain<TimeZoneId> {
  private _offsetMinutes: OffsetMinutes;
  private _offsetHours: OffsetHours;
  private _isDaylightSavingTime: boolean;
  private _description: string;
  private _timeZoneStringId: TimeZoneStringId;

  private constructor(properties: TimeZoneDomainConstructor) {
    super(properties.id);
    this._offsetHours = properties.offsetHours;
    this._offsetMinutes = properties.offsetMinutes;
    this._timeZoneStringId = properties.timeZoneStringId;
    this._description = this.formatTimezoneDescription();
    this._isDaylightSavingTime = properties.isDaylightSavingTime;
  }

  public static create(
    args: TimeZoneDomainArgs
  ): Result<TimeZoneDomain, ErrorResult> {
    const resultId = TimeZoneId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const offsetMinutesResult = OffsetMinutes.create(args.offsetMinutes);
    if (offsetMinutesResult.isErr()) {
      return err(offsetMinutesResult.error);
    }
    const offsetHoursResult = OffsetHours.create(args.offsetHours);
    if (offsetHoursResult.isErr()) {
      return err(offsetHoursResult.error);
    }
    const timeZoneStringIdResult = TimeZoneStringId.create(
      args.timeZoneStringId
    );
    if (timeZoneStringIdResult.isErr()) {
      return err(timeZoneStringIdResult.error);
    }
    const id = resultId.value;
    const offsetMinutes = offsetMinutesResult.value;
    const offsetHours = offsetHoursResult.value;
    const timeZoneStringId = timeZoneStringIdResult.value;

    const domain = new TimeZoneDomain({
      id,
      offsetMinutes,
      offsetHours,
      timeZoneStringId,
      isDaylightSavingTime: args.isDaylightSavingTime,
    });
    return ok(domain);
  }

  formatTimezoneDescription(): string {
    const hours = this._offsetHours.value;
    const minutes = this._offsetMinutes.value;
    const offsetStr = `UTC${hours >= 0 ? '+' : '-'}${Math.abs(hours)
      .toString()
      .padStart(2, '0')}:${Math.abs(minutes).toString().padStart(2, '0')}`;
    return `${this._timeZoneStringId.value} (${offsetStr})`;
  }

  get properties(): TimeZoneDomainProperties {
    return {
      id: this._id.value,
      offsetMinutes: this._offsetMinutes.value,
      offsetHours: this._offsetHours.value,
      timeZoneStringId: this._timeZoneStringId.value,
      description: this._description,
      isDaylightSavingTime: this._isDaylightSavingTime,
    };
  }
}

export default TimeZoneDomain;
