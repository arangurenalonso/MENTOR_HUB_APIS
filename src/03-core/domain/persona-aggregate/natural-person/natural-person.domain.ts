import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import PersonDomain from '../root/persona.domain';
import EmailDomain, {
  EmailDomainCreateArg,
  EmailDomainProperties,
} from '../email/email.domain';
import PersonTypeEnum from '../root/enum/person-type.enum';
import PersonId from '../root/value-object/person.value-object';
import Name from './value-object/name.value-object';
import Birthdate from './value-object/birthdate.value-object';
import PersonErrors from '../root/error/person.error';

type NaturalPersonDomainProperties = {
  id: string;
  personId: PersonId;
  emails: EmailDomainProperties[];
  name: string;
  birthdate: Date | null;
  personType: PersonTypeEnum;
};

type NaturalPersonDomainCreateArg = {
  id?: string;
  name: string;
  email: EmailDomainCreateArg | EmailDomainCreateArg[];
  birthdate?: Date | null;
};

type NaturalPersonDomainConstructor = {
  id: PersonId;
  personType: PersonTypeEnum;
  emails: EmailDomain[];
  name: Name;
  birthdate: Birthdate | null;
};

class NaturalPersonDomain extends PersonDomain {
  private _name: Name;
  private _birthday: Birthdate | null;
  private constructor(properties: NaturalPersonDomainConstructor) {
    super({
      id: properties.id,
      personType: properties.personType,
      emails: properties.emails,
    });
    this._name = properties.name;
    this._birthday = properties.birthdate;
  }

  public static create(
    args: NaturalPersonDomainCreateArg
  ): Result<NaturalPersonDomain, ErrorResult> {
    const resultId = PersonId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const id = resultId.value;

    const emailArgs = Array.isArray(args.email) ? args.email : [args.email];
    const emailDomains: EmailDomain[] = [];

    for (const emailArg of emailArgs) {
      const resultEmail = EmailDomain.create(emailArg);
      if (resultEmail.isErr()) {
        return err(resultEmail.error);
      }
      emailDomains.push(resultEmail.value);
    }
    const isPrimaryEmail = emailDomains.filter((x) => x.properties.is_primary);

    if (isPrimaryEmail?.length != 1) {
      return err(
        PersonErrors.INVALID_NUMBER_OF_PRIMARY_EMAILS(isPrimaryEmail?.length)
      );
    }

    const nameResult = Name.create(args.name);
    if (nameResult.isErr()) {
      return err(nameResult.error);
    }
    const name = nameResult.value;

    const birthDateResult = Birthdate.create(args.birthdate);
    if (birthDateResult.isErr()) {
      return err(birthDateResult.error);
    }
    const birthdate = birthDateResult.value;

    const naturalPerson = new NaturalPersonDomain({
      id,
      personType: PersonTypeEnum.NATURAL,
      emails: emailDomains,
      name,
      birthdate,
    });
    return ok(naturalPerson);
  }

  get properties(): NaturalPersonDomainProperties {
    return {
      id: this._id.value,
      personId: this._id,
      emails: this._emails.map((email) => email.properties),
      name: this._name.value,
      birthdate: this._birthday?.value || null,
      personType: this._personType,
    };
  }
}

export default NaturalPersonDomain;
