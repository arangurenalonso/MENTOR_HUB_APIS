import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler } from 'mediatr-ts';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import UpdateInstructorAvailabilityCommand from './updateAvailability.command';
import InstructorAvailabilityDomain from '@domain/intructor-aggregate/availability/instructor-availability.domain';
import AvailabilityRequestDTO from './availability.request.dto';
import DayOfWeekDomain from '@domain/intructor-aggregate/availability/day-of-week.domain';
import TimeOptionDomain from '@domain/intructor-aggregate/availability/time-option.domain';
import CommonApplicationError from '@application/errors/common-application-error';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import InstructorApplicationErrors from '@application/errors/instructor-application.error';

@injectable()
@requestHandler(UpdateInstructorAvailabilityCommand)
class UpdateInstructorAvailabilityCommandhandler
  implements
    IRequestHandler<
      UpdateInstructorAvailabilityCommand,
      Result<void, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.InstructorRepository)
    private _instructorRepository: IInstructorRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork
  ) {}
  async handle(
    command: UpdateInstructorAvailabilityCommand
  ): Promise<Result<void, ErrorResult>> {
    const fetchEntitiesResult = await this.fetchEntities(
      command.availability,
      command.idInstructor
    );
    if (fetchEntitiesResult.isErr()) {
      return err(fetchEntitiesResult.error);
    }

    const { dayOfWeekDomains, timeOptionDomains, instructorDomain } =
      fetchEntitiesResult.value;

    console.log('instructorDomain', instructorDomain);

    const instructorAvailabilityDomainArrayResult =
      this.convertInstructorAvailabilityArray(
        command.availability,
        dayOfWeekDomains,
        timeOptionDomains
      );

    if (instructorAvailabilityDomainArrayResult.isErr()) {
      return err(instructorAvailabilityDomainArrayResult.error);
    }
    const instructorAvailabilityDomainArray =
      instructorAvailabilityDomainArrayResult.value;

    const resultUpdateAvailability = instructorDomain.updateAvailability(
      instructorAvailabilityDomainArray
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

  private async fetchEntities(
    availability: AvailabilityRequestDTO[],
    idInstructor: string
  ): Promise<
    Result<
      {
        dayOfWeekDomains: DayOfWeekDomain[];
        timeOptionDomains: TimeOptionDomain[];
        instructorDomain: InstructorDomain;
      },
      ErrorResult
    >
  > {
    const idsDayOfWeek = [...new Set(availability.map((x) => x.idDayOfWeek))];
    const idsTimeOption = [
      ...new Set([
        ...availability.map((x) => x.idStartTime),
        ...availability.map((x) => x.idFinalTime),
      ]),
    ];

    const [
      dayOfWeekEntitiesResult,
      timeOptionEntitiesResult,
      instructorDomainResult,
    ] = await Promise.all([
      this._instructorRepository.getDayOfWeekByIdArray(idsDayOfWeek),
      this._instructorRepository.getTimeOptionsByIdArray(idsTimeOption),
      this._instructorRepository.getInstructorById(idInstructor),
    ]);

    if (dayOfWeekEntitiesResult.isErr()) {
      return err(dayOfWeekEntitiesResult.error);
    }

    if (timeOptionEntitiesResult.isErr()) {
      return err(timeOptionEntitiesResult.error);
    }
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
      dayOfWeekDomains: dayOfWeekEntitiesResult.value,
      timeOptionDomains: timeOptionEntitiesResult.value,
      instructorDomain: instructorDomain,
    });
  }

  private convertInstructorAvailabilityArray(
    availability: AvailabilityRequestDTO[],
    dayOfWeekEntities: DayOfWeekDomain[],
    timeOptionEntities: TimeOptionDomain[]
  ): Result<InstructorAvailabilityDomain[], ErrorResult> {
    const domainArray: InstructorAvailabilityDomain[] = [];

    for (const item of availability) {
      const dayOfWeek = dayOfWeekEntities.find(
        (y) => y.properties.id === item.idDayOfWeek
      );
      const startTime = timeOptionEntities.find(
        (y) => y.properties.id === item.idStartTime
      );
      const finalTime = timeOptionEntities.find(
        (y) => y.properties.id === item.idFinalTime
      );

      const domain = InstructorAvailabilityDomain.create({
        id: item.id,
        dayOfWeek: dayOfWeek!,
        startTime: startTime!,
        finalTime: finalTime!,
      });

      if (domain.isErr()) {
        return err(domain.error);
      }

      domainArray.push(domain.value);
    }

    return ok(domainArray);
  }
}
export default UpdateInstructorAvailabilityCommandhandler;
