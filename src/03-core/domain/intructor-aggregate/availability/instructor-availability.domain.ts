import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import InstructorAvailabilityId from './value-object/instructor-availability-id.value-object';
import DayOfWeekDomain, {
  DayOfWeekDomainProperties,
} from './day-of-week.domain';
import TimeOptionDomain, {
  TimeOptionDomainProperties,
} from './time-option.domain';
import InstructorAvailabilityDomainErrors from './error/instructor.domain.error';

export type InstructorAvailabilityDomainProperties = {
  id: string;
  dayOfWeek: DayOfWeekDomainProperties;
  startTime: TimeOptionDomainProperties;
  finalTime: TimeOptionDomainProperties;
};
export type InstructorAvailabilityDomainArgs = {
  id?: string;
  dayOfWeek: DayOfWeekDomain;
  startTime: TimeOptionDomain;
  finalTime: TimeOptionDomain;
};

type InstructorAvailabilityDomainConstructor = {
  id: InstructorAvailabilityId;
  dayOfWeek: DayOfWeekDomain;
  startTime: TimeOptionDomain;
  finalTime: TimeOptionDomain;
};

class InstructorAvailabilityDomain extends BaseDomain<InstructorAvailabilityId> {
  private _dayOfWeek: DayOfWeekDomain;
  private _startTime: TimeOptionDomain;
  private _finalTime: TimeOptionDomain;
  private constructor(properties: InstructorAvailabilityDomainConstructor) {
    super(properties.id);
    this._dayOfWeek = properties.dayOfWeek;
    this._startTime = properties.startTime;
    this._finalTime = properties.finalTime;
  }

  public static create(
    args: InstructorAvailabilityDomainArgs
  ): Result<InstructorAvailabilityDomain, ErrorResult> {
    const resultId = InstructorAvailabilityId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const id = resultId.value;
    const dayOfWeek = args.dayOfWeek;
    const startTime = args.startTime;
    const finalTime = args.finalTime;
    if (startTime.properties.index >= finalTime.properties.index) {
      return err(
        InstructorAvailabilityDomainErrors.START_TIME_GREATER_OR_EQUAL_FINAL_TIME(
          startTime.properties.value,
          finalTime.properties.value
        )
      );
    }

    const entity = new InstructorAvailabilityDomain({
      id,
      dayOfWeek,
      startTime,
      finalTime,
    });
    return ok(entity);
  }

  get properties(): InstructorAvailabilityDomainProperties {
    return {
      id: this._id.value,
      dayOfWeek: this._dayOfWeek.properties,
      startTime: this._startTime.properties,
      finalTime: this._finalTime.properties,
    };
  }
}

export default InstructorAvailabilityDomain;
