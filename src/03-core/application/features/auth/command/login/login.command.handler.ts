import IPasswordService from '@application/contracts/Ipassword.service';
import ITokenService from '@application/contracts/IToken.service';
import AuthApplicationErrors from '@application/errors/auth-application.error';
import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserErrors from '@domain/user-aggregate/root/error/user-error';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import LoginCommand from './login.command';
import PersonApplicationErrors from '@application/errors/person-application.error';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';

@injectable()
@requestHandler(LoginCommand)
class LoginCommandHandler
  implements
    IRequestHandler<LoginCommand, Result<AuthenticationResult, ErrorResult>>
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(
    command: LoginCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    this.validate(command.email, command.username);
    const userResult = await this.getUser(command.email);

    if (userResult.isErr()) {
      return err(userResult.error);
    }

    const user = userResult.value;
    if (user.properties.passwordHash == null) {
      return err(
        AuthApplicationErrors.USER_CREATION_WITH_SOCIAL_PROVIDER_ERROR()
      );
    }

    const isValidPassword = await this._passwordService.decrypt(
      command.password,
      user.properties.passwordHash
    );
    if (!isValidPassword) {
      return err(AuthApplicationErrors.CREDENTIAL_INCORRECT);
    }
    const personResult = await this._personRepository.getPersonById(
      user.properties.id
    );
    if (personResult.isErr()) {
      return err(personResult.error);
    }
    const person = personResult.value;
    if (person === null) {
      return err(PersonApplicationErrors.PERSON_NOT_FOUND(user.properties.id));
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
  private validate(email: string, username: string): void {
    if (!email && !username) {
      throw new Error('Email or username is required.');
    }
  }
  private async getUser(
    email: string
  ): Promise<Result<UserDomain, ErrorResult>> {
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
      return err(UserErrors.USER_NOT_FOUND);
    }

    return ok(user);
  }
}
export default LoginCommandHandler;
