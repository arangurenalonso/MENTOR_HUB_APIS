import IPasswordService from '@application/contracts/Ipassword.service';
import ITokenService from '@application/contracts/IToken.service';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import CreateInstructorProfileCommand from './create-profile.command';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';

@injectable()
@requestHandler(CreateInstructorProfileCommand)
class CreateInstructorProfileCommandHandler
  implements
    IRequestHandler<
      CreateInstructorProfileCommand,
      Result<boolean, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {}
  async handle(
    command: CreateInstructorProfileCommand
  ): Promise<Result<boolean, ErrorResult>> {
    return ok(true);
  }
}
export default CreateInstructorProfileCommandHandler;
