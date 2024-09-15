import TYPES from '@config/inversify/identifiers';
import IOutboxMessageRepository from '@domain/cross-cutting-concern/outbox/repository/IOutboxMessage.repository';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import ExecOutboxMessagesCommand from './exec-outboxMessages.command';

@injectable()
@requestHandler(ExecOutboxMessagesCommand)
class ExecOutboxMessagesCommandHandler
  implements IRequestHandler<ExecOutboxMessagesCommand, void>
{
  constructor(
    @inject(TYPES.Mediator) private _mediator: Mediator,
    @inject(TYPES.IOutboxMessageRepository)
    private _outboxMessage: IOutboxMessageRepository
  ) {}
  async handle(command: ExecOutboxMessagesCommand): Promise<void> {
    const domainsEvents = await this._outboxMessage.getDomainEvents();
    // console.log('domainsEvents', domainsEvents);

    for (const domainEvent of domainsEvents) {
      try {
        await this._mediator.publish(domainEvent.event);
        await this._outboxMessage.markAsProcessed(domainEvent.outboxMessageId);
      } catch (error) {
        const errorMessage = `${error}`;
        console.error(error);
        await this._outboxMessage.markAsError(
          domainEvent.outboxMessageId,
          errorMessage
        );
      }
    }
  }
}
export default ExecOutboxMessagesCommandHandler;
