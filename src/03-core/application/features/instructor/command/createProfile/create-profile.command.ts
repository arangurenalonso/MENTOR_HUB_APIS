import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import TokenPayload from '@application/models/TokenPayload.model';

class CreateInstructorProfileCommand
  implements IRequest<Result<boolean, ErrorResult>>
{
  constructor(public readonly userConnected: TokenPayload) {}
}

export default CreateInstructorProfileCommand;
