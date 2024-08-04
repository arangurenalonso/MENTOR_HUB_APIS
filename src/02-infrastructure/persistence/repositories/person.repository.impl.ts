import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TYPES from '@config/inversify/identifiers';
import { injectable, inject } from 'inversify';
import { Repository, DataSource, EntityManager } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import NaturalPersonEntity from '@persistence/entities/person-aggreagte/natural_person.entity';
import PersonEntity from '@persistence/entities/person-aggreagte/person.entity';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import EmailEntity from '@persistence/entities/person-aggreagte/email.entity';
import PersonDTO from '@infrastructure/dto/person.dto';

@injectable()
class PersonRepository
  extends BaseRepository<PersonEntity>
  implements IPersonRepository
{
  private _repository: Repository<PersonEntity>;
  private _naturalPersonRepository: Repository<NaturalPersonEntity>;
  private _emailRepository: Repository<EmailEntity>;
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
      this._dataSourceOrEntityManager.getRepository(PersonEntity);
    this._naturalPersonRepository =
      this._dataSourceOrEntityManager.getRepository(NaturalPersonEntity);
    this._emailRepository =
      this._dataSourceOrEntityManager.getRepository(EmailEntity);
  }

  protected get repository(): Repository<PersonEntity> {
    return this._repository;
  }

  async register(
    naturalPersonDomain: NaturalPersonDomain
  ): Promise<Result<void, ErrorResult>> {
    const naturalPersonEntityResult = PersonDTO.toEntity(naturalPersonDomain);
    if (naturalPersonEntityResult.isErr()) {
      return err(naturalPersonEntityResult.error);
    }

    console.log(
      'naturalPersonEntityResult.value',
      naturalPersonEntityResult.value
    );
    const personEntity = naturalPersonEntityResult.value;
    await this._repository.save(personEntity);
    await this._emailRepository.save(personEntity.emails);
    await this._naturalPersonRepository.save(personEntity.naturalPerson!);
    return ok(undefined);
  }
  async getPersonById(
    id: string
  ): Promise<Result<NaturalPersonDomain | null, ErrorResult>> {
    const personEntity = await this._repository.findOne({
      where: { id: id },
      relations: ['naturalPerson', 'legalPerson', 'emails'],
    });
    console.log('personEntity', personEntity);
    if (!personEntity) {
      return ok(null);
    }
    const personDomainResult = PersonDTO.toDomain(personEntity);
    if (personDomainResult.isErr()) {
      return err(personDomainResult.error);
    }
    const person = personDomainResult.value;
    return ok(person);
  }
}
export default PersonRepository;
