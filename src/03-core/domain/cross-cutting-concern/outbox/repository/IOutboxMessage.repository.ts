import IDomainEvent from '@domain/abstract/IDomainEvent';

interface IOutboxMessageRepository {
  getDomainEvents(): Promise<
    { outboxMessageId: string; event: IDomainEvent }[]
  >;

  markAsProcessed(outboxMessageId: string): Promise<void>;
  markAsError(outboxMessageId: string, error: string): Promise<void>;
}
export default IOutboxMessageRepository;
