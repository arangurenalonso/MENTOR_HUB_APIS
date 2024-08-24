import CommonApplicationError from '@application/errors/common-application-error';
import InstructorApplicationErrors from '@application/errors/instructor-application.error';
import TYPES from '@config/inversify/identifiers';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import { Result, err, ok } from 'neverthrow';
import UpdateAboutCommand from './updateAbout.command';

@injectable()
@requestHandler(UpdateAboutCommand)
class UpdateAboutCommandhandler
  implements IRequestHandler<UpdateAboutCommand, Result<void, ErrorResult>>
{
  constructor(
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: UpdateAboutCommand
  ): Promise<Result<void, ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(command.idInstructor);
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { instructorDomain } = fetchEntitiesResult.value;

    const resultUpdateAvailability = instructorDomain.profile(
      command.headline,
      command.introduction,
      command.teachingExperience,
      command.motivation
    );
    if (resultUpdateAvailability.isErr()) {
      return err(resultUpdateAvailability.error);
    }

    try {
      await this._unitOfWork.startTransaction();
      await this._unitOfWork.instructorRepository.modify(instructorDomain);
      await this._unitOfWork.commit();
    } catch (error) {
      console.log('error', error);
      await this._unitOfWork.rollback();
      return err(InstructorApplicationErrors.UPDATE_ERROR(`${error}`));
    }

    return ok(undefined);
  }

  private async fetchEntities(idInstructor: string): Promise<
    Result<
      {
        instructorDomain: InstructorDomain;
      },
      ErrorResult
    >
  > {
    const [instructorDomainResult] = await Promise.all([
      this._instructorRepository.getInstructorById(idInstructor),
    ]);

    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }

    const instructorDomain = instructorDomainResult.value;
    if (!instructorDomain) {
      return err(
        CommonApplicationError.notFound('Instructor', [
          {
            property: 'id',
            value: idInstructor,
          },
        ])
      );
    }

    return ok({
      instructorDomain: instructorDomain,
    });
  }
}
export default UpdateAboutCommandhandler;
