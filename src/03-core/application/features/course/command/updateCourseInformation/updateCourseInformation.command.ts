import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';

class UpdateCourseInformationCommand
  implements IRequest<Result<void, ErrorResult>>
{
  constructor(
    public readonly idCourse: string,
    public readonly idInstructor: string,
    public readonly idSubCategory: string,
    public readonly idLevel: string,
    public readonly title: string,
    public readonly description: string
  ) {}
}

export default UpdateCourseInformationCommand;
