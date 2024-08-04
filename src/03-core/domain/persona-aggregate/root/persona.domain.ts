import BaseDomain from '@domain/abstract/BaseDomain';
import { err, ok, Result } from 'neverthrow';
import PersonId from './value-object/person.value-object';
import PersonTypeEnum from './enum/person-type.enum';
import EmailDomain from '../email/email.domain';
// import UserDomain from '@domain/user-aggregate/root/user.domain';

type PersonDomainConstructor = {
  id: PersonId;
  personType: PersonTypeEnum;
  emails: EmailDomain[];
  // user?: UserDomain | null;
};

class PersonDomain extends BaseDomain<PersonId> {
  protected _emails: EmailDomain[];
  protected _personType: PersonTypeEnum;
  // protected _user?: UserDomain|null;

  protected constructor(properties: PersonDomainConstructor) {
    super(properties.id);
    this._personType = properties.personType;
    this._emails = properties.emails;
    // this._user = properties.user;
  }
}

export default PersonDomain;
