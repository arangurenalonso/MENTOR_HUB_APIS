import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import TokenPayload from '@application/models/TokenPayload.model';

class CreateCourseCommand implements IRequest<Result<string, ErrorResult>> {
  constructor(
    public readonly userConnected: TokenPayload,
    public readonly idSubCategory: string,
    public readonly idLevel: string,
    public readonly title: string,
    public readonly description: string
  ) {}
}

export default CreateCourseCommand;
