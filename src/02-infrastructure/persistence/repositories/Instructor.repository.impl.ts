import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TYPES from '@config/inversify/identifiers';
import { injectable, inject } from 'inversify';
import { Repository, DataSource, EntityManager } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import PersonEntity from '@persistence/entities/person-aggreagte/person.entity';
import PersonDTO from '@infrastructure/dto/person.dto';
import InstructorEntity from '@persistence/entities/instructor-aggregate/instructor.entity';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import RoleDomain from '@domain/user-aggregate/role/role.domain';

@injectable()
class InstructorRepository
  extends BaseRepository<InstructorEntity>
  implements IInstructorRepository
{
  private _repository: Repository<InstructorEntity>;
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
  }

  protected get repository(): Repository<InstructorEntity> {
    return this._repository;
  }

  getById(id: string): Promise<Result<RoleDomain | null, ErrorResult>> {
    throw new Error('Method not implemented.');
  }
  //   async getPersonById(
  //     id: string
  //   ): Promise<Result<NaturalPersonDomain | null, ErrorResult>> {
  //     const personEntity = await this._repository.findOne({
  //       where: { id: id },
  //       relations: ['naturalPerson', 'legalPerson', 'emails'],
  //     });
  //     console.log('personEntity', personEntity);
  //     if (!personEntity) {
  //       return ok(null);
  //     }
  //     const personDomainResult = PersonDTO.toDomain(personEntity);
  //     if (personDomainResult.isErr()) {
  //       return err(personDomainResult.error);
  //     }
  //     const person = personDomainResult.value;
  //     return ok(person);
  //   }
}
export default InstructorRepository;
