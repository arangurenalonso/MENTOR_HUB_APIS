import { IRequest } from 'mediatr-ts';

class ExecOutboxMessagesCommand implements IRequest<void> {
  constructor() {}
}

export default ExecOutboxMessagesCommand;
