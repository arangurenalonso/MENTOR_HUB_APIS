import IPasswordService from '@application/contracts/Ipassword.service';
import AuthApplicationErrors from '@application/errors/auth-application.error';
import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserErrors from '@domain/user-aggregate/root/error/user-error';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import LoginCommand from './login.command';
import AuthenticationResultQuery from '../../query/authentication-result/authentication-result.query';

@injectable()
@requestHandler(LoginCommand)
class LoginCommandHandler
  implements
    IRequestHandler<LoginCommand, Result<AuthenticationResult, ErrorResult>>
{
  constructor(
    @inject(TYPES.Mediator) private _mediator: Mediator,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
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
    return await this._mediator.send(
      new AuthenticationResultQuery(user.properties.id)
    );
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
