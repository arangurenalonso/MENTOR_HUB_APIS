import { ErrorResult } from '@domain/abstract/result-abstract';

class NaturalPersonErrors {
  static readonly PERSON_INVALID_BIRTHDAY = (
    reasons: string[]
  ): ErrorResult => {
    return new ErrorResult(
      'PERSON.BIRTHDAY',
      `Person Birthdate is invalid: ${reasons.join(', ')}`,
      400
    );
  };
}

export default NaturalPersonErrors;
