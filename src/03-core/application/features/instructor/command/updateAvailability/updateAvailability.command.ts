import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import AuthenticationResult from '@application/models/AuthenticationResult';
import AvailabilityRequestDTO from './availability.request.dto';

class UpdateInstructorAvailabilityCommand
  implements IRequest<Result<AuthenticationResult, ErrorResult>>
{
  constructor(public readonly availability: AvailabilityRequestDTO[]) {}
}

export default UpdateInstructorAvailabilityCommand;
