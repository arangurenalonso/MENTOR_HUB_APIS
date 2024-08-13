import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import AuthenticationResult from '@application/models/AuthenticationResult';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import TYPES from '@config/inversify/identifiers';
import ITokenService from '@application/contracts/IToken.service';
import PersonApplicationErrors from '@application/errors/person-application.error';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import AuthenticationResultQuery from './authentication-result.query';
import UserErrors from '@domain/user-aggregate/root/error/user-error';

@injectable()
@requestHandler(AuthenticationResultQuery)
class AuthenticationResultQueryHandler
  implements
    IRequestHandler<
      AuthenticationResultQuery,
      Result<AuthenticationResult, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository
  ) {}
  async handle(
    command: AuthenticationResultQuery
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    const [userDomainResult, personResult] = await Promise.all([
      this._userRepository.getUserById(command.idUser),
      this._personRepository.getPersonById(command.idUser),
    ]);

    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }
    if (personResult.isErr()) {
      return err(personResult.error);
    }

    const person = personResult.value;
    const userDomain = userDomainResult.value;

    if (userDomain === null) {
      return err(UserErrors.USER_NOT_FOUND);
    }
    if (person === null) {
      return err(PersonApplicationErrors.PERSON_NOT_FOUND);
    }

    const tokenResult = await this._tokenService.generateToken({
      id: userDomain.properties.id!,
      email: userDomain.properties.email,
      name: person.properties.name,
      timeZone: {
        id: userDomain.properties.timeZone.id,
        description: userDomain.properties.timeZone.description,
        offsetMinutes: userDomain.properties.timeZone.offsetMinutes,
        offsetHours: userDomain.properties.timeZone.offsetHours,
        timeZoneStringId: userDomain.properties.timeZone.timeZoneStringId,
      },
      roles: userDomain.properties.roles.map((x) => {
        return {
          id: x.id,
          description: x.description,
        };
      }),
    });

    if (tokenResult.isErr()) {
      return err(tokenResult.error);
    }

    if (tokenResult.isErr()) {
      return err(tokenResult.error);
    }
    return ok(new AuthenticationResult(tokenResult.value, true, ''));
  }
}
export default AuthenticationResultQueryHandler;
