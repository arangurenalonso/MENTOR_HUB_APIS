import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import ITokenService from '@application/contracts/IToken.service';
import AuthenticationResult from '@application/models/AuthenticationResult';
import CreateInstructorProfileCommand from '../createProfile/create-profile.command';
import UpdateInstructorAvailabilityCommand from './updateAvailability.command';

@injectable()
@requestHandler(UpdateInstructorAvailabilityCommand)
class UpdateInstructorAvailabilityCommandhandler
  implements
    IRequestHandler<
      UpdateInstructorAvailabilityCommand,
      Result<AuthenticationResult, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.InstructorRepository)
    private _InstructorRepository: IInstructorRepository,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: UpdateInstructorAvailabilityCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    // const [instructorDomainResult, userDomainResult] = await Promise.all([
    //   this._getInstructorById(command.userConnected.id),
    //   this._getUserById(command.userConnected.id),
    // ]);

    return ok(new AuthenticationResult('tokenResult.value', true, ''));
  }
}
export default UpdateInstructorAvailabilityCommandhandler;
