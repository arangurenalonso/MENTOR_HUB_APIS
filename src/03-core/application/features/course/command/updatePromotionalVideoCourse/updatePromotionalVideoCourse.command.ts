import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';

class UpdatePromotionalVideoCourseCommand
  implements IRequest<Result<string, ErrorResult>>
{
  constructor(
    public readonly file: Express.Multer.File,
    public readonly idCourse: string,
    public readonly idInstructor: string
  ) {}
}

export default UpdatePromotionalVideoCourseCommand;
