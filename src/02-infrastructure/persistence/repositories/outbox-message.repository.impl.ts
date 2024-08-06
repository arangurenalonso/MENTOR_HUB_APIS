import { inject, injectable } from 'inversify';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import OutboxMessageEntity from '@persistence/entities/OutboxMessage.entity';
import IDomainEvent from '@domain/abstract/IDomainEvent';
import { plainToInstance } from 'class-transformer';
import TYPES from '@config/inversify/identifiers';
import IOutboxMessageRepository from '@domain/cross-cutting-concern/outbox/repository/IOutboxMessage.repository';
import eventMapping from '@config/eventMapping';

@injectable()
class OutboxMessageRepository
  extends BaseRepository<OutboxMessageEntity>
  implements IOutboxMessageRepository
{
  private _repository: Repository<OutboxMessageEntity>;

  constructor(
    @inject(TYPES.DataSource)
    private readonly _dataSourceOrEntityManager: DataSource | EntityManager
  ) {
    super();
    if (this._dataSourceOrEntityManager instanceof DataSource) {
      // console.log('instance of DataSource');
      this._repository =
        this._dataSourceOrEntityManager.getRepository(OutboxMessageEntity);
    } else if (this._dataSourceOrEntityManager instanceof EntityManager) {
      // console.log('instance of EntityManager');
      this._repository =
        this._dataSourceOrEntityManager.getRepository(OutboxMessageEntity);
    } else {
      throw new Error('Invalid constructor argument');
    }
  }
  async getDomainEvents(): Promise<
    { outboxMessageId: string; event: IDomainEvent }[]
  > {
    const outboxMessages = await this._repository.find({
      where: {
        isProcessed: false,
        processedOnUtc: IsNull(),
      },
      order: {
        occurredOnUtc: 'ASC',
      },
      take: 10,
    });

    const domainEvents: { outboxMessageId: string; event: IDomainEvent }[] = [];

    for (const message of outboxMessages) {
      const eventType = message.type;
      const EventClass = eventMapping[eventType];

      if (!EventClass) {
        const error = `No mapping found for event type: ${eventType}; check file eventMapping.ts`;
        console.error(error);

        await this._repository.update(
          { id: message.id },
          { isProcessed: true, error: error }
        );
        continue;
      }

      const event = plainToInstance(EventClass, JSON.parse(message.content));
      domainEvents.push({
        outboxMessageId: message.id!,
        event: event,
      });
    }
    const idsToUpdate = outboxMessages.map((message) => message.id);
    if (idsToUpdate?.length > 0) {
      await this._repository.update(
        { id: In(idsToUpdate) },
        { isProcessed: true }
      );
    }
    return domainEvents;
  }

  async markAsProcessed(outboxMessageId: string): Promise<void> {
    await this._repository.update(
      { id: outboxMessageId },
      { isProcessed: true, error: '', processedOnUtc: new Date() }
    );
  }

  async markAsError(outboxMessageId: string, error: string): Promise<void> {
    await this._repository.update(
      { id: outboxMessageId },
      { isProcessed: true, error: error, processedOnUtc: new Date() }
    );
  }
  protected get repository(): Repository<OutboxMessageEntity> {
    return this._repository;
  }
}
export default OutboxMessageRepository;
