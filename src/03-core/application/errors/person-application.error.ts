import ErrorResult from '@domain/abstract/result-abstract/error';

class PersonApplicationErrors {
  static readonly PERSON_NOT_FOUND = (idPerson: string) => {
    return new ErrorResult(
      'PERSON.SEARCH',
      `Error while searching person: person with id '${idPerson}' not found`,
      400
    );
  };
}

export default PersonApplicationErrors;
