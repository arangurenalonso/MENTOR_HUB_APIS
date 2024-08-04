import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import CronService from '../cron.service';
import TYPES from '@config/inversify/identifiers';
import ExecOutboxMessagesCommand from '@application/features/outboxMessages/command/exec-outboxMessages.command';

@injectable()
class OutboxMessageJob {
  private isRunning: boolean = false;
  constructor(
    @inject(TYPES.Mediator) private _mediator: Mediator,
    @inject(TYPES.CronService) private _cronService: CronService
  ) {}

  start() {
    console.log('OutboxMessageJob started');
    this._cronService.createJob('*/10 * * * * *', async () => {
      if (!this.isRunning) {
        this.isRunning = true;
        try {
          await this._mediator.send(new ExecOutboxMessagesCommand());
        } catch (error) {
          console.error('Error executing outbox messages command:', error);
        } finally {
          this.isRunning = false;
        }
      } else {
        console.log(
          'Attempt to run outbox messages while job is already running.'
        );
      }
    });
  }

  stop() {
    console.log('OutboxMessageJob stopped');
  }
}

export default OutboxMessageJob;
