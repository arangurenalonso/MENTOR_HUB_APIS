import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import BaseDomain from '@domain/abstract/BaseDomain';
import TimeOptionId from './value-object/time-option-id.value-object';
import Time from './value-object/time.value-object';
import TimeIndex from './value-object/time-option-index.value-object';

export type TimeOptionDomainProperties = {
  id: string;
  value: string;
  index: number;
};
export type TimeOptionDomainArgs = {
  id?: string;
  value: string;
  index: number;
};

type TimeOptionDomainConstructor = {
  id: TimeOptionId;
  index: TimeIndex;
  value: Time;
};

class TimeOptionDomain extends BaseDomain<TimeOptionId> {
  private _index: TimeIndex;
  private _value: Time;
  private constructor(properties: TimeOptionDomainConstructor) {
    super(properties.id);
    this._index = properties.index;
    this._value = properties.value;
  }

  public static create(
    args: TimeOptionDomainArgs
  ): Result<TimeOptionDomain, ErrorResult> {
    const resultId = TimeOptionId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultIndex = TimeIndex.create(args.index);
    if (resultIndex.isErr()) {
      return err(resultIndex.error);
    }
    const resultValue = Time.create(args.value);
    if (resultValue.isErr()) {
      return err(resultValue.error);
    }

    const id = resultId.value;
    const index = resultIndex.value;
    const value = resultValue.value;

    const entity = new TimeOptionDomain({
      id,
      index,
      value,
    });
    return ok(entity);
  }

  get properties(): TimeOptionDomainProperties {
    return {
      id: this._id.value,
      index: this._index.value,
      value: this._value.value,
    };
  }
}

export default TimeOptionDomain;
