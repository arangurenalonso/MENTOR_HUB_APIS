import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';

class UpdatePublishCourseCommand
  implements IRequest<Result<void, ErrorResult>>
{
  constructor(
    public readonly idCourse: string,
    public readonly idInstructor: string
  ) {}
}

export default UpdatePublishCourseCommand;
