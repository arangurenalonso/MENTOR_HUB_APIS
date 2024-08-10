import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import RegisterCommand from './register.command';
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

@injectable()
@requestHandler(RegisterCommand)
class RegisterCommandHandler
  implements
    IRequestHandler<RegisterCommand, Result<AuthenticationResult, ErrorResult>>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(
    command: RegisterCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    const validation = await this.validate(command.email);
    if (validation.isErr()) {
      return err(validation.error);
    }

    const timeZoneDomainResult = await this._userRepository.getTimeZoneById(
      command.timeZoneIdString
    );
    if (timeZoneDomainResult.isErr()) {
      return err(timeZoneDomainResult.error);
    }

    const timeZoneDomain = timeZoneDomainResult.value;
    if (!timeZoneDomain) {
      return err(
        UserApplicationErrors.USER_TIMEZONE_NOT_FOUND(command.timeZoneIdString)
      );
    }
    const passwordHash = await this._passwordService.encrypt(command.password);
    const roleGuest = RoleDomain.create({
      id: RoleEnum.GUEST.id,
      description: RoleEnum.GUEST.description,
    });
    if (roleGuest.isErr()) {
      return err(roleGuest.error);
    }
    const userResult = UserDomain.create({
      email: command.email,
      passwordHash: passwordHash,
      roles: [roleGuest.value],
      timeZone: timeZoneDomain,
    });
    if (userResult.isErr()) {
      return err(userResult.error);
    }
    const user = userResult.value;

    const personResult = NaturalPersonDomain.create({
      id: user.properties.id,
      name: command.name,
      email: {
        email_address: command.email,
        is_primary: true,
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
    const tokenResult = await this._tokenService.generateToken({
      id: user.properties.id!,
      email: user.properties.email,
      name: person.properties.name,
      timeZone: {
        id: user.properties.timeZone.id,
        description: user.properties.timeZone.description,
        offsetMinutes: user.properties.timeZone.offsetMinutes,
        offsetHours: user.properties.timeZone.offsetHours,
        timeZoneStringId: user.properties.timeZone.timeZoneStringId,
      },
      roles: user.properties.roles.map((x) => {
        return {
          id: x.id,
          description: x.description,
        };
      }),
    });

    if (tokenResult.isErr()) {
      return err(tokenResult.error);
    }
    return ok(new AuthenticationResult(tokenResult.value, true, ''));
  }
  private async validate(email: string): Promise<Result<boolean, ErrorResult>> {
    const userEmail = await this._userRepository.getUserByEmail(email);
    if (userEmail.isErr()) {
      return err(userEmail.error);
    }
    if (userEmail.value) {
      return err(UserApplicationErrors.USER_ALREADY_EXISTS('email', email));
    }
    return ok(true);
  }
}
export default RegisterCommandHandler;
