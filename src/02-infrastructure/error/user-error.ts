import { ErrorResult } from '@domain/abstract/result-abstract';

class PersonInfrastructureError {
  static readonly PERSON_TYPE_NOT_FOUND: ErrorResult = new ErrorResult(
    'Person.Type',
    'Person type not found',
    400
  );
}

export default PersonInfrastructureError;
