import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import PersonDomain from '../root/persona.domain';
import EmailDomain, {
  EmailDomainCreateArg,
  EmailDomainProperties,
} from '../email/email.domain';
import PersonTypeEnum from '../root/enum/person-type.enum';
import PersonId from '../root/value-object/person-id.value-object';
import Name from './value-object/name.value-object';
import Birthdate from './value-object/birthdate.value-object';
import PersonErrors from '../root/error/person.error';
import URLImage from '@domain/intructor-aggregate/social-media/value-object/urlImage.value-object';

export type NaturalPersonDomainProperties = {
  id: string;
  personId: PersonId;
  photoUrl: string | null;
  name: string;
  emails: EmailDomainProperties[];
  birthdate: Date | null;
  personType: PersonTypeEnum;
};

export type NaturalPersonDomainCreateArg = {
  id?: string;
  photoUrl?: string | null;
  name: string;
  email: EmailDomainCreateArg | EmailDomainCreateArg[];
  birthdate?: Date | null;
};

export type NaturalPersonDomainConstructor = {
  id: PersonId;
  photoUrl: URLImage | null;
  name: Name;
  emails: EmailDomain[];
  birthdate: Birthdate | null;
  personType: PersonTypeEnum;
};

class NaturalPersonDomain extends PersonDomain {
  private _name: Name;
  private _photoUrl: URLImage | null;
  private _birthday: Birthdate | null;
  private constructor(properties: NaturalPersonDomainConstructor) {
    super({
      id: properties.id,
      personType: properties.personType,
      emails: properties.emails,
    });
    this._name = properties.name;
    this._birthday = properties.birthdate;
    this._photoUrl = properties.photoUrl;
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

    const photoUrlResult = URLImage.create(args.photoUrl);

    if (photoUrlResult.isErr()) {
      return err(photoUrlResult.error);
    }
    const photoUrl = photoUrlResult.value;

    const naturalPerson = new NaturalPersonDomain({
      id,
      personType: PersonTypeEnum.NATURAL,
      emails: emailDomains,
      name,
      birthdate,
      photoUrl,
    });
    return ok(naturalPerson);
  }
  public verifyEmail = (email: string): Result<void, ErrorResult> => {
    const emailToVerify = this._emails.find(
      (x) =>
        x.properties.email_address?.trim().toLowerCase() ===
        email?.trim().toLowerCase()
    );
    if (!emailToVerify) {
      return err(PersonErrors.EMAIL_NOT_FOUND(this._name.value, email));
    }
    emailToVerify.verify();
    return ok(undefined);
  };
  public updatePhotho = (
    photoUrlToUpdate?: string | null
  ): Result<void, ErrorResult> => {
    const photoUrlResult = URLImage.create(photoUrlToUpdate);

    if (photoUrlResult.isErr()) {
      return err(photoUrlResult.error);
    }
    const photoUrl = photoUrlResult.value;
    this._photoUrl = photoUrl;
    return ok(undefined);
  };
  get properties(): NaturalPersonDomainProperties {
    return {
      id: this._id.value,
      personId: this._id,
      emails: this._emails.map((email) => email.properties),
      name: this._name.value,
      birthdate: this._birthday?.value || null,
      personType: this._personType,
      photoUrl: this._photoUrl?.value || null,
    };
  }
}

export default NaturalPersonDomain;
