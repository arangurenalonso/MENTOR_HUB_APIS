import Email from './value-object/email.value-object';
import PasswordHash from './value-object/passwordhast.value-object';
import UserId from './value-object/user-id.value-object';
import UserCreatedDomainEvent from './events/user-created.domain-event';
import BaseDomain from '@domain/abstract/BaseDomain';
import RoleDomain, { RoleDomainProperties } from '../role/role.domain';
import UserErrors from './error/user-error';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TimeZoneDomain, {
  TimeZoneDomainProperties,
} from '../timezone/time-zone.domain';

type UserDomainProperties = {
  id: string;
  email: string;
  passwordHash: string;
  roles: RoleDomainProperties[];
  userId: UserId;
  timeZone: TimeZoneDomainProperties;
};

type UserDomainCreateArg = {
  id?: string;
  email: string;
  passwordHash: string;
  roles: RoleDomain[];
  timeZone: TimeZoneDomain;
};

type UserDomainConstructor = {
  id: UserId;
  email: Email;
  passwordHash: PasswordHash;
  roles: RoleDomain[];
  timeZone: TimeZoneDomain;
};

class UserDomain extends BaseDomain<UserId> {
  private _passwordHash: PasswordHash;
  private _email: Email;
  private _roles: RoleDomain[];
  private _timeZone: TimeZoneDomain;

  private constructor(properties: UserDomainConstructor) {
    super(properties.id);
    this._email = properties.email;
    this._passwordHash = properties.passwordHash;
    this._roles = properties.roles;
    this._timeZone = properties.timeZone;
  }

  public static create(
    args: UserDomainCreateArg
  ): Result<UserDomain, ErrorResult> {
    if (!args.roles || args.roles?.length === 0) {
      return err(UserErrors.USER_NOT_ROLE_PROVIDE());
    }

    const resultId = UserId.create(args.id);
    if (resultId.isErr()) {
      return err(resultId.error);
    }
    const resultEmail = Email.create(args.email);
    if (resultEmail.isErr()) {
      return err(resultEmail.error);
    }
    const resultPasswordHash = PasswordHash.create(args.passwordHash);
    if (resultPasswordHash.isErr()) {
      return err(resultPasswordHash.error);
    }

    const passwordHash = resultPasswordHash.value;
    const id = resultId.value;
    const email = resultEmail.value;

    const user = new UserDomain({
      id,
      email,
      passwordHash,
      roles: args.roles,
      timeZone: args.timeZone,
    });
    if (!args.id) {
      user.raiseDomainEvent(new UserCreatedDomainEvent(user._id.value));
    }

    return ok(user);
  }

  public addRol(role: RoleDomain) {
    const roleAlreadyExistInList = this._roles.some(
      (x) => x.properties.id === role.properties.id
    );
    if (roleAlreadyExistInList) {
      return;
    }

    this._roles.push(role);
  }
  get properties(): UserDomainProperties {
    return {
      id: this._id.value,
      userId: this._id,
      email: this._email?.value,
      passwordHash: this._passwordHash.value,
      roles: this._roles.map((x) => x.properties),
      timeZone: this._timeZone.properties,
    };
  }
}

export default UserDomain;
