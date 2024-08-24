import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class UpdateAboutCommand implements IRequest<Result<void, ErrorResult>> {
  constructor(
    public readonly idInstructor: string,
    public readonly headline: string,
    public readonly introduction: string,
    public readonly teachingExperience: string,
    public readonly motivation: string
  ) {}
}

export default UpdateAboutCommand;
