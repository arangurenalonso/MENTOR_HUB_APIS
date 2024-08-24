import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class UpdateAboutCommand implements IRequest<Result<void, ErrorResult>> {
  constructor(
    public readonly idInstructor: string,
    public readonly introductionText: string,
    public readonly teachingExperienceText: string,
    public readonly motivationText: string
  ) {}
}

export default UpdateAboutCommand;
