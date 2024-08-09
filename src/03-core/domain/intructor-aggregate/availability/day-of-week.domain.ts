import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import DayOfWeekId from './value-object/day-of-week-Id.value-object';
import DayIndex from './value-object/day-index.value-object';
import DayName from './value-object/day-name.value-object';
import domainRules from '@domain/helpers/regular-exp';
import InstructorAvailabilityDomainErrors from './error/instructor.domain.error';

export type DayOfWeekDomainProperties = {
  id: string;
  dayIndex: number;
  dayName: string;
};
export type DayOfWeekDomainArgs = {
  id?: string;
  dayIndex: number;
  dayName: string;
};

type DayOfWeekDomainConstructor = {
  id: DayOfWeekId;
  dayIndex: DayIndex;
  dayName: DayName;
};

class DayOfWeekDomain extends BaseDomain<DayOfWeekId> {
  private _dayIndex: DayIndex;
  private _dayName: DayName;
  private constructor(properties: DayOfWeekDomainConstructor) {
    super(properties.id);
    this._dayIndex = properties.dayIndex;
    this._dayName = properties.dayName;
  }

  public static create(
    args: DayOfWeekDomainArgs
  ): Result<DayOfWeekDomain, ErrorResult> {
    const resultId = DayOfWeekId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultDayIndex = DayIndex.create(args.dayIndex);
    if (resultDayIndex.isErr()) {
      return err(resultDayIndex.error);
    }
    const resultDayName = DayName.create(args.dayName);
    if (resultDayName.isErr()) {
      return err(resultDayName.error);
    }

    const dayStringNameOfIndex =
      domainRules.dayNameValid[resultDayIndex.value.value];
    if (
      dayStringNameOfIndex.trim().toLowerCase() !==
      resultDayName.value.value.trim().toLowerCase()
    ) {
      return err(
        InstructorAvailabilityDomainErrors.DATE_NAME_INDEX_MISMATCH(
          resultDayName.value.value,
          resultDayIndex.value.value
        )
      );
    }

    const id = resultId.value;
    const dayIndex = resultDayIndex.value;
    const dayName = resultDayName.value;

    const entity = new DayOfWeekDomain({
      id,
      dayIndex,
      dayName,
    });
    return ok(entity);
  }

  get properties(): DayOfWeekDomainProperties {
    return {
      id: this._id.value,
      dayIndex: this._dayIndex.value,
      dayName: this._dayName.value,
    };
  }
}

export default DayOfWeekDomain;
