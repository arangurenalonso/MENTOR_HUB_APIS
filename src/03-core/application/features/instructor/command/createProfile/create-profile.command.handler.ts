import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import CreateInstructorProfileCommand from './create-profile.command';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import InstructorApplicationErrors from '@application/errors/instructor-application.error';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserApplicationErrors from '@application/errors/user-application.error';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import PersonApplicationErrors from '@application/errors/person-application.error';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import ITokenService from '@application/contracts/IToken.service';
import AuthenticationResult from '@application/models/AuthenticationResult';
import UserDomain from '@domain/user-aggregate/root/user.domain';
@injectable()
@requestHandler(CreateInstructorProfileCommand)
class CreateInstructorProfileCommandHandler
  implements
    IRequestHandler<
      CreateInstructorProfileCommand,
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
    command: CreateInstructorProfileCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    const [instructorDomainResult, userDomainResult] = await Promise.all([
      this._getInstructorById(command.userConnected.id),
      this._getUserById(command.userConnected.id),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }

    if (instructorDomainResult.value) {
      return err(
        InstructorApplicationErrors.ALREADY_EXISTS(command.userConnected.id)
      );
    }

    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }

    const userDomain = userDomainResult.value;
    const instructorResult = await this._createInstructorProfile(
      userDomain,
      command.userConnected.id
    );

    if (instructorResult.isErr()) {
      return err(instructorResult.error);
    }
    const tokenResult = await this._generateToken(
      userDomainResult.value,
      command.userConnected.id
    );

    if (tokenResult.isErr()) {
      return err(tokenResult.error);
    }

    return ok(new AuthenticationResult(tokenResult.value, true, ''));
  }
  private async _getInstructorById(
    id: string
  ): Promise<Result<InstructorDomain | null, ErrorResult>> {
    const [instructorDomainResult] = await Promise.all([
      this._InstructorRepository.getById(id),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }

    if (instructorDomainResult.value) {
      return err(InstructorApplicationErrors.ALREADY_EXISTS(id));
    }

    return ok(null);
  }

  private async _getUserById(
    id: string
  ): Promise<Result<UserDomain, ErrorResult>> {
    const [userDomainResult] = await Promise.all([
      this._userRepository.getUserById(id),
    ]);

    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }

    if (!userDomainResult.value) {
      return err(UserApplicationErrors.USER_NOT_FOUND(id));
    }

    const userDomain = userDomainResult.value;

    const roleInstructor = RoleDomain.create({
      id: RoleEnum.INSTRUCTOR.id,
      description: RoleEnum.INSTRUCTOR.description,
    });

    if (roleInstructor.isErr()) {
      return err(roleInstructor.error);
    }

    userDomain.addRol(roleInstructor.value);

    return ok(userDomain);
  }
  private async _createInstructorProfile(
    userDomain: UserDomain,
    userId: string
  ): Promise<Result<boolean, ErrorResult>> {
    const instructorResult = InstructorDomain.create({
      id: userId,
    });

    if (instructorResult.isErr()) {
      return err(instructorResult.error);
    }

    const instructor = instructorResult.value;

    try {
      await this._unitOfWork.startTransaction();
      await this._unitOfWork.instructorRepository.register(instructor);
      console.log('AAAAAAAAAAAAAAAAAA');

      await this._userRepository.modify(userDomain);
      console.log('BBBBBBBBBBBBBBBBB');
      this._unitOfWork.collectDomainEvents([instructor, userDomain]);
      await this._unitOfWork.commit();
      console.log('CCCCCCCCCCCCCCCCCCCCCC');
    } catch (error) {
      console.log('error', error);

      await this._unitOfWork.rollback();
      return err(InstructorApplicationErrors.CREATE_ERROR(`${error}`));
    }

    return ok(true);
  }
  private async _generateToken(
    userDomain: UserDomain,
    userId: string
  ): Promise<Result<string, ErrorResult>> {
    const personResult = await this._personRepository.getPersonById(userId);

    if (personResult.isErr()) {
      return err(personResult.error);
    }

    const person = personResult.value;

    if (person === null) {
      return err(PersonApplicationErrors.PERSON_NOT_FOUND);
    }

    const tokenResult = await this._tokenService.generateToken({
      id: userDomain.properties.id!,
      email: userDomain.properties.email,
      name: person.properties.name,
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

    return ok(tokenResult.value);
  }
}
export default CreateInstructorProfileCommandHandler;
