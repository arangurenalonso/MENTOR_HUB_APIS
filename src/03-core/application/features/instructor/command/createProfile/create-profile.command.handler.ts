import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import CreateInstructorProfileCommand from './create-profile.command';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import InstructorApplicationErrors from '@application/errors/instructor-application.error';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserApplicationErrors from '@application/errors/user-application.error';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import AuthenticationResult from '@application/models/AuthenticationResult';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import AuthenticationResultQuery from '@application/features/auth/query/authentication-result/authentication-result.query';
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
    @inject(TYPES.Mediator) private _mediator: Mediator,
    @inject(TYPES.InstructorRepository)
    private _InstructorRepository: IInstructorRepository,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: CreateInstructorProfileCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    const [instructorDomainResult, userDomainResult] = await Promise.all([
      this._getInstructorById(command.userConnected.idUser),
      this._getUserById(command.userConnected.idUser),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }

    if (instructorDomainResult.value) {
      return err(
        InstructorApplicationErrors.ALREADY_EXISTS(command.userConnected.idUser)
      );
    }

    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }

    const userDomain = userDomainResult.value;
    const instructorResult = await this._createInstructorProfile(
      userDomain,
      command.userConnected.idUser
    );

    if (instructorResult.isErr()) {
      return err(instructorResult.error);
    }
    return await this._mediator.send(
      new AuthenticationResultQuery(command.userConnected.idUser)
    );
  }
  private async _getInstructorById(
    id: string
  ): Promise<Result<InstructorDomain | null, ErrorResult>> {
    const instructorDomainResult =
      await this._InstructorRepository.getInstructorById(id);
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
      await this._userRepository.modify(userDomain);
      this._unitOfWork.collectDomainEvents([instructor, userDomain]);
      await this._unitOfWork.commit();
    } catch (error) {
      console.log('error', error);

      await this._unitOfWork.rollback();
      return err(InstructorApplicationErrors.CREATE_ERROR(`${error}`));
    }

    return ok(true);
  }
}
export default CreateInstructorProfileCommandHandler;
