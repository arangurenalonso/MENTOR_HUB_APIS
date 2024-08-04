import ErrorResult from '@domain/abstract/result-abstract/error';

class PersonApplicationErrors {
  static readonly PERSON_NOT_FOUND = new ErrorResult(
    'PERSON.SEARCH',
    'Error while searching person: person not found',
    400
  );
}

export default PersonApplicationErrors;
