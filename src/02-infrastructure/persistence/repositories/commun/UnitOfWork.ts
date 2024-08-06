import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { injectable, inject } from 'inversify';
import IDomainEvent from '@domain/abstract/IDomainEvent';
import { Mediator } from 'mediatr-ts';
import OutboxMessageEntity from '@persistence/entities/OutboxMessage.entity';
import TYPES from '@config/inversify/identifiers';
import BaseDomain from '@domain/abstract/BaseDomain';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserRepository from '../user.repository.impl';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import PersonRepository from '../person.repository.impl';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import InstructorRepository from '../Instructor.repository.impl';

@injectable()
class UnitOfWork implements IUnitOfWork {
  private _queryRunner: QueryRunner | null = null;
  private _entityManager: EntityManager | null = null;
  private _userRepository: IUserRepository | null = null;
  private _personRepository: IPersonRepository | null = null;
  private _instructorRepository: IInstructorRepository | null = null;

  private _domainEvents: IDomainEvent[] = [];

  constructor(
    @inject(TYPES.DataSource) private readonly _dataSource: DataSource,
    @inject(TYPES.Mediator) private readonly _mediator: Mediator
  ) {}

  get userRepository(): IUserRepository {
    if (!this._entityManager) {
      throw new Error('Transaction has not been started');
    }
    return (this._userRepository ||= new UserRepository(this._entityManager));
  }

  get personRepository(): IPersonRepository {
    if (!this._entityManager) {
      throw new Error('Transaction has not been started');
    }
    return (this._personRepository ||= new PersonRepository(
      this._entityManager
    ));
  }

  get instructorRepository(): IInstructorRepository {
    if (!this._entityManager) {
      throw new Error('Transaction has not been started');
    }
    return (this._instructorRepository ||= new InstructorRepository(
      this._entityManager
    ));
  }

  async startTransaction(): Promise<void> {
    this._queryRunner = this._dataSource.createQueryRunner();
    await this._queryRunner.startTransaction();
    this._entityManager = this._queryRunner.manager;
  }

  async commit(): Promise<void> {
    if (!this._queryRunner) {
      throw new Error('Transaction has not been started');
    }
    await this._queryRunner.commitTransaction();
    await this.addDomainEventsAsOutboxMessages();
    // await this.dispatchDomainEvents();
    await this.dispose();
  }

  async rollback(): Promise<void> {
    if (!this._queryRunner) {
      throw new Error('Transaction has not been started');
    }
    await this._queryRunner.rollbackTransaction();
    await this.dispose();
  }

  private async dispose(): Promise<void> {
    if (this._queryRunner) {
      await this._queryRunner.release();
    }
    this._entityManager = null;
    this._queryRunner = null;
  }

  get entityManager(): EntityManager | null {
    return this._entityManager;
  }

  collectDomainEvents(domains: BaseDomain<any>[]): void {
    domains.forEach((domain) => {
      this._domainEvents.push(...domain.getAndClearDomainEvents());
    });
  }
  private async addDomainEventsAsOutboxMessages(): Promise<void> {
    const outboxRepository =
      this._dataSource.getRepository(OutboxMessageEntity);
    const outboxMessages = this._domainEvents.map((event) => {
      const outboxMessage = new OutboxMessageEntity();
      outboxMessage.type = event.constructor.name;
      outboxMessage.content = JSON.stringify(event);
      return outboxMessage;
    });
    if (outboxMessages.length > 0) {
      await outboxRepository.save(outboxMessages);
    }

    this._domainEvents = [];
  }
}

export default UnitOfWork;
