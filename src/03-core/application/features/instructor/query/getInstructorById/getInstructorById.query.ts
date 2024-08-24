import { ErrorResult } from '@domain/abstract/result-abstract';
import { InstructorDomainProperties } from '@domain/intructor-aggregate/root/instructor.domain';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class GetInstructorByIdQuery
  implements IRequest<Result<InstructorDomainProperties, ErrorResult>>
{
  constructor(public readonly idInstructor: string) {}
}

export default GetInstructorByIdQuery;
