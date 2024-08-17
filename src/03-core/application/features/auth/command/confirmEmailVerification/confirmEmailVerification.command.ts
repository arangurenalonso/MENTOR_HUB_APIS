import AuthenticationResult from '@application/models/AuthenticationResult';

import { Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';

class ConfirmEmailVerificationCommand
  implements IRequest<Result<AuthenticationResult, ErrorResult>>
{
  constructor(public readonly verificationEmailToken: string) {}
}

export default ConfirmEmailVerificationCommand;
