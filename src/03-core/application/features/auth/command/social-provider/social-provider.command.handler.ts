import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import AuthenticationResult from '@application/models/AuthenticationResult';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import UserApplicationErrors from '@application/errors/user-application.error';
import TYPES from '@config/inversify/identifiers';
import IPasswordService from '@application/contracts/Ipassword.service';
import ITokenService from '@application/contracts/IToken.service';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import SocialProviderCommand from './social-provider.command';
import PersonApplicationErrors from '@application/errors/person-application.error';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import AuthenticationResultQuery from '../../query/authentication-result/authentication-result.query';
import { ProviderEnum } from '@domain/user-aggregate/provider/enum/provider.enum';
import AuthProviderDomain from '@domain/user-aggregate/provider/auth-provider.domain';
import userDomain from '@domain/user-aggregate/root/user.domain';

@injectable()
@requestHandler(SocialProviderCommand)
class SocialProviderCommandHandler
  implements
    IRequestHandler<
      SocialProviderCommand,
      Result<AuthenticationResult, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.Mediator) private _mediator: Mediator,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository
  ) {}
  async handle(
    command: SocialProviderCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    const userDomainByUidResult =
      await this._userRepository.getIdUserByUidProvider(command.uid);
    if (userDomainByUidResult.isErr()) {
      return err(userDomainByUidResult.error);
    }
    const userDomainByUid = userDomainByUidResult.value;
    if (userDomainByUid) {
      return await this._mediator.send(
        new AuthenticationResultQuery(userDomainByUid.properties.id)
      );
    }

    const userDomainByEmailResult = await this.getUserByEmail(command.email);
    if (userDomainByEmailResult.isErr()) {
      return err(userDomainByEmailResult.error);
    }
    const userDomainByEmail = userDomainByEmailResult.value;
    if (userDomainByEmail) {
      const result = await this.addSocialProvierToUser(
        userDomainByEmail,
        command.email,
        command.uid,
        command.provider
      );
      if (result.isErr()) {
        return err(result.error);
      }
      return await this._mediator.send(
        new AuthenticationResultQuery(userDomainByEmail.properties.id)
      );
    }
    const userDomainCreatedResult = await this.createNewUser(
      command.name,
      command.email,
      command.timeZoneIdString,
      command.uid,
      command.provider,
      command.photoURL
    );
    if (userDomainCreatedResult.isErr()) {
      return err(userDomainCreatedResult.error);
    }
    const userDomainCreated = userDomainCreatedResult.value;
    return await this._mediator.send(
      new AuthenticationResultQuery(userDomainCreated.properties.id)
    );
  }

  private async addSocialProvierToUser(
    user: UserDomain,
    email: string,
    uid: string,
    provider: ProviderEnum
  ): Promise<Result<UserDomain, ErrorResult>> {
    const personResult = await this._personRepository.getPersonById(
      user.properties.id
    );

    if (personResult.isErr()) {
      return err(personResult.error);
    }
    const person = personResult.value;
    if (!person) {
      return err(PersonApplicationErrors.PERSON_NOT_FOUND(user.properties.id));
    }
    person.verifyEmail(email);
    const providerDomainResult = await AuthProviderDomain.create({
      provider: provider,
      uid: uid,
    });
    if (providerDomainResult.isErr()) {
      return err(providerDomainResult.error);
    }
    const providerDomain = providerDomainResult.value;
    user.addSocialMediaProvider(providerDomain);

    try {
      await this._unitOfWork.startTransaction();

      await Promise.all([
        this._unitOfWork.userRepository.modify(user),
        this._unitOfWork.personRepository.modify(person),
      ]);
      // await this._unitOfWork.userRepository.modify(user);
      // await this._unitOfWork.personRepository.modify(person);

      this._unitOfWork.collectDomainEvents([user]);

      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();

      return err(UserApplicationErrors.USER_CREATE_ERROR(`${error}`));
    }

    return ok(user);
  }
  private async getUserByEmail(
    email: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    let user: UserDomain | null = null;
    if (email) {
      const userEmailResult = await this._userRepository.getUserByEmail(email);
      if (userEmailResult.isErr()) {
        return err(userEmailResult.error);
      }
      if (userEmailResult.value) {
        user = userEmailResult.value;
      }
    }
    if (!user) {
      return ok(null);
    }

    return ok(user);
  }

  private async createNewUser(
    name: string,
    email: string,
    timeZoneIdString: string,
    uid: string,
    provider: ProviderEnum,
    photoURL?: string | null
  ): Promise<Result<UserDomain, ErrorResult>> {
    const providerDomainResult = await AuthProviderDomain.create({
      provider: provider,
      uid: uid,
    });
    if (providerDomainResult.isErr()) {
      return err(providerDomainResult.error);
    }
    const providerDomain = providerDomainResult.value;
    const timeZoneDomainResult = await this._userRepository.getTimeZoneById(
      timeZoneIdString
    );
    if (timeZoneDomainResult.isErr()) {
      return err(timeZoneDomainResult.error);
    }
    const timeZoneDomain = timeZoneDomainResult.value;
    if (!timeZoneDomain) {
      return err(
        UserApplicationErrors.USER_TIMEZONE_NOT_FOUND(timeZoneIdString)
      );
    }

    const roleGuest = RoleDomain.create({
      id: RoleEnum.GUEST.id,
      description: RoleEnum.GUEST.description,
    });
    if (roleGuest.isErr()) {
      return err(roleGuest.error);
    }
    const userResult = UserDomain.create({
      email: email,
      roles: [roleGuest.value],
      timeZone: timeZoneDomain,
      providers: [providerDomain],
    });
    if (userResult.isErr()) {
      return err(userResult.error);
    }
    const user = userResult.value;

    const personResult = NaturalPersonDomain.create({
      id: user.properties.id,
      name: name,
      photoUrl: photoURL,
      email: {
        email_address: email,
        is_primary: true,
        is_verified: true,
      },
    });
    if (personResult.isErr()) {
      return err(personResult.error);
    }
    const person: NaturalPersonDomain = personResult.value;
    try {
      await this._unitOfWork.startTransaction();

      await this._unitOfWork.userRepository.register(user);
      await this._unitOfWork.personRepository.register(person);

      this._unitOfWork.collectDomainEvents([user]);

      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();

      return err(UserApplicationErrors.USER_CREATE_ERROR(`${error}`));
    }
    return ok(user);
  }
}
export default SocialProviderCommandHandler;
