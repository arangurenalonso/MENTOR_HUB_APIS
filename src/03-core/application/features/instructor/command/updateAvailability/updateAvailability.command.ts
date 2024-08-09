import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import AvailabilityRequestDTO from './availability.request.dto';
import TokenPayload from '@application/models/TokenPayload.model';

class UpdateInstructorAvailabilityCommand
  implements IRequest<Result<void, ErrorResult>>
{
  constructor(
    public readonly idInstructor: string,
    public readonly availability: AvailabilityRequestDTO[],
    public readonly userConnected: TokenPayload
  ) {}
}

export default UpdateInstructorAvailabilityCommand;
