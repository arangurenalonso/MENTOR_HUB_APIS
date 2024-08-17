import ErrorResult from '@domain/abstract/result-abstract/error';

class PersonApplicationErrors {
  static readonly PERSON_NOT_FOUND = (idPerson: string) => {
    return new ErrorResult(
      'PERSON.SEARCH',
      `Error while searching person: person with id '${idPerson}' not found`,
      400
    );
  };
  static readonly EMAIL_NOT_FOUND = (email: string, id: string) => {
    return new ErrorResult(
      'PERSON.EMAIL',
      `Person with id '${id}' dosent have the email '${email}'`,
      400
    );
  };
}

export default PersonApplicationErrors;
