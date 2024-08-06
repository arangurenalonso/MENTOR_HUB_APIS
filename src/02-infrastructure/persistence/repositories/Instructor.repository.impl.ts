import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TYPES from '@config/inversify/identifiers';
import { injectable, inject } from 'inversify';
import { Repository, DataSource, EntityManager } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import InstructorEntity from '@persistence/entities/instructor-aggregate/instructor.entity';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import InstructorDTO from '@infrastructure/dto/instructor-aggregate/instructor.dto';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import InstructorSocialMediaEntity from '@persistence/entities/instructor-aggregate/instructor-social-media.entity';

@injectable()
class InstructorRepository
  extends BaseRepository<InstructorEntity>
  implements IInstructorRepository
{
  private _repository: Repository<InstructorEntity>;
  private _instructorSocialMediarepository: Repository<InstructorSocialMediaEntity>;
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
    this._instructorSocialMediarepository =
      this._dataSourceOrEntityManager.getRepository(
        InstructorSocialMediaEntity
      );
  }

  protected get repository(): Repository<InstructorEntity> {
    return this._repository;
  }

  async getById(
    id: string
  ): Promise<Result<InstructorDomain | null, ErrorResult>> {
    // const instructorEntity = await this._repository.findOne({
    //   where: { id: id },
    //   relations: ['instructorSocialMedia', 'instructorSocialMedia.socialMedia'],
    // });

    const instructorEntity = await this._repository
      .createQueryBuilder('instructor')
      .leftJoinAndSelect('instructor.instructorSocialMedia', 'socialMedia')
      .leftJoinAndSelect('socialMedia.socialMedia', 'media')
      .where('instructor.id = :id', { id })
      .andWhere('instructor.active = :instructorActive', {
        instructorActive: true,
      })
      .andWhere('socialMedia.active = :socialMediaActive', {
        socialMediaActive: true,
      })
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
    this._instructorSocialMediarepository.save(
      instructorDomainResult.instructorSocialMedia
    );
  }
}
export default InstructorRepository;
