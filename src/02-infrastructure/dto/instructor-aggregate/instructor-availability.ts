import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorAvailabilityDomain from '@domain/intructor-aggregate/availability/instructor-availability.domain';
import InstructorAvailabilityEntity from '@persistence/entities/instructor-aggregate/intructor-availability.entity';
import DayOfWeekDomain from '@domain/intructor-aggregate/availability/day-of-week.domain';
import TimeOptionDomain from '@domain/intructor-aggregate/availability/time-option.domain';
import { InstructorAvailabilityDomainProperties } from '../../../03-core/domain/intructor-aggregate/availability/instructor-availability.domain';
import CommonInfrastructureError from '@infrastructure/error/common-error';

class InstructorAvailabilityDTO {
  public static ToDomain(
    entity: InstructorAvailabilityEntity
  ): Result<InstructorAvailabilityDomain, ErrorResult> {
    if (!entity.dayOfWeek) {
      return err(
        CommonInfrastructureError.missingField(
          'DayOfWeek',
          'InstructorAvailability'
        )
      );
    }

    if (!entity.startTime) {
      return err(
        CommonInfrastructureError.missingField(
          'startTime',
          'InstructorAvailability'
        )
      );
    }

    if (!entity.finalTime) {
      return err(
        CommonInfrastructureError.missingField(
          'finalTime',
          'InstructorAvailability'
        )
      );
    }

    const dayOfWeek = DayOfWeekDomain.create({
      id: entity.dayOfWeek.id,
      dayIndex: entity.dayOfWeek.index,
      dayName: entity.dayOfWeek.name,
    });
    if (dayOfWeek.isErr()) {
      return err(dayOfWeek.error);
    }
    const startTime = TimeOptionDomain.create({
      id: entity.startTime.id,
      value: entity.startTime.value,
      index: entity.startTime.index,
    });
    if (startTime.isErr()) {
      return err(startTime.error);
    }
    const finalTime = TimeOptionDomain.create({
      id: entity.finalTime.id,
      value: entity.finalTime.value,
      index: entity.finalTime.index,
    });
    if (finalTime.isErr()) {
      return err(finalTime.error);
    }
    const domainResult = InstructorAvailabilityDomain.create({
      id: entity.id,
      dayOfWeek: dayOfWeek.value,
      startTime: startTime.value,
      finalTime: finalTime.value,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toDomainArray(
    entities?: InstructorAvailabilityEntity[] | null
  ): Result<InstructorAvailabilityDomain[], ErrorResult> {
    if (!entities) {
      return ok([]);
    }
    const availabilityDomain: InstructorAvailabilityDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.ToDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      availabilityDomain.push(entityResult.value);
    }
    return ok(availabilityDomain);
  }

  public static toEntity(
    idInstructor: string,
    domain: InstructorAvailabilityDomainProperties
  ): InstructorAvailabilityEntity {
    const entity = new InstructorAvailabilityEntity();
    entity.id = domain.id;
    entity.idInstructor = idInstructor;
    entity.idDayOfWeek = domain.dayOfWeek.id;
    entity.idStartTime = domain.startTime.id;
    entity.idFinalTime = domain.finalTime.id;
    return entity;
  }

  public static toEntityArray(
    idInstructor: string,
    domainArray: InstructorAvailabilityDomainProperties[] = []
  ): InstructorAvailabilityEntity[] {
    return domainArray.map((domain) => this.toEntity(idInstructor, domain));
  }
}
export default InstructorAvailabilityDTO;
