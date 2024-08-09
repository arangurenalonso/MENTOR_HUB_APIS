import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TYPES from '@config/inversify/identifiers';
import { injectable, inject } from 'inversify';
import { Repository, DataSource, EntityManager, Brackets, In } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import InstructorEntity from '@persistence/entities/instructor-aggregate/instructor.entity';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import InstructorDTO from '@infrastructure/dto/instructor-aggregate/instructor.dto';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import InstructorSocialMediaEntity from '@persistence/entities/instructor-aggregate/instructor-social-media.entity';
import DayOfWeekEntity from '@persistence/entities/instructor-aggregate/day-of-week.entity';
import InstructorAvailabilityEntity from '@persistence/entities/instructor-aggregate/intructor-availability.entity';
import TimeOptionEntity from '@persistence/entities/instructor-aggregate/time-options.entity';
import DayOfWeekDomain from '@domain/intructor-aggregate/availability/day-of-week.domain';
import DayOfWeekDTO from '@infrastructure/dto/instructor-aggregate/day-of-week.dto';
import CommonInfrastructureError from '@infrastructure/error/common-error';
import TimeOptionDomain from '@domain/intructor-aggregate/availability/time-option.domain';
import TimeOptionDTO from '@infrastructure/dto/instructor-aggregate/time-option.dto';

@injectable()
class InstructorRepository
  extends BaseRepository<InstructorEntity>
  implements IInstructorRepository
{
  private _repository: Repository<InstructorEntity>;
  private _instructorSocialMediaRepository: Repository<InstructorSocialMediaEntity>;
  private _dayOfWeekRepository: Repository<DayOfWeekEntity>;
  private _instructorAvailabilityRepository: Repository<InstructorAvailabilityEntity>;
  private _timeOptionRepository: Repository<TimeOptionEntity>;
  constructor(
    @inject(TYPES.DataSource)
    private readonly _dataSourceOrEntityManager: DataSource | EntityManager
  ) {
    super();
    if (this._dataSourceOrEntityManager instanceof DataSource) {
      console.log('instance of DataSource');
    } else if (this._dataSourceOrEntityManager instanceof EntityManager) {
      console.log('instance of EntityManager');
    } else {
      throw new Error('Invalid constructor argument');
    }
    this._repository =
      this._dataSourceOrEntityManager.getRepository(InstructorEntity);
    this._instructorSocialMediaRepository =
      this._dataSourceOrEntityManager.getRepository(
        InstructorSocialMediaEntity
      );
    this._dayOfWeekRepository =
      this._dataSourceOrEntityManager.getRepository(DayOfWeekEntity);
    this._instructorAvailabilityRepository =
      this._dataSourceOrEntityManager.getRepository(
        InstructorAvailabilityEntity
      );
    this._timeOptionRepository =
      this._dataSourceOrEntityManager.getRepository(TimeOptionEntity);
  }

  protected get repository(): Repository<InstructorEntity> {
    return this._repository;
  }

  async getDayOfWeekByIdArray(
    ids: string[]
  ): Promise<Result<DayOfWeekDomain[] | null, ErrorResult>> {
    const dayOfWeekEntities = await this._dayOfWeekRepository.findBy({
      id: In(ids),
      active: true,
    });
    const foundIds = dayOfWeekEntities.map((entity) => entity.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      return err(CommonInfrastructureError.missingIds(missingIds, 'DayOfWeek'));
    }

    const dayOfWeekDomainResult = DayOfWeekDTO.toDomainArray(dayOfWeekEntities);
    if (dayOfWeekDomainResult.isErr()) {
      return err(dayOfWeekDomainResult.error);
    }
    return ok(dayOfWeekDomainResult.value);
  }
  async getTimeOptionByIdArray(
    ids: string[]
  ): Promise<Result<TimeOptionDomain[] | null, ErrorResult>> {
    const timeOptionEntities = await this._timeOptionRepository.findBy({
      id: In(ids),
      active: true,
    });
    const foundIds = timeOptionEntities.map((entity) => entity.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      return err(
        CommonInfrastructureError.missingIds(missingIds, 'TimeOptionEntity')
      );
    }

    const timeOptionDomainResult =
      TimeOptionDTO.toDomainArray(timeOptionEntities);
    if (timeOptionDomainResult.isErr()) {
      return err(timeOptionDomainResult.error);
    }
    return ok(timeOptionDomainResult.value);
  }

  async getInstructorById(
    id: string
  ): Promise<Result<InstructorDomain | null, ErrorResult>> {
    // const instructorEntity = await this._repository.findOne({
    //   where: { id: id },
    //   relations: ['instructorSocialMedia', 'instructorSocialMedia.socialMedia'],
    // });

    const instructorEntity = await this._repository
      .createQueryBuilder('instructor')
      .leftJoinAndSelect(
        'instructor.instructorSocialMedia',
        'instructorSocialMedia'
      )
      .leftJoinAndSelect('instructorSocialMedia.socialMedia', 'socialMedia')
      .where('instructor.id = :id', { id })
      .andWhere('instructor.active = :instructorActive', {
        instructorActive: true,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('socialMedia.active is null').orWhere(
            'socialMedia.active = :socialMediaActive',
            {
              socialMediaActive: true,
            }
          );
        })
      )
      .getOne();
    if (!instructorEntity) {
      return ok(null);
    }
    const instructorDomainResult = InstructorDTO.toDomain(instructorEntity);
    if (instructorDomainResult.isErr()) {
      return err(instructorDomainResult.error);
    }
    const instructor = instructorDomainResult.value;
    return ok(instructor);
  }

  async register(instructorEntity: InstructorDomain): Promise<void> {
    const instructorDomainResult = InstructorDTO.toEntity(instructorEntity);
    await this.create(instructorDomainResult);
    this._instructorSocialMediaRepository.save(
      instructorDomainResult.instructorSocialMedia
    );
  }
}
export default InstructorRepository;
