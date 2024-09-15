import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { IRequest } from 'mediatr-ts';
import IntendedLearnersRequestDTO from './intendedLearners.request.dto';
import LearningObjectivesRequestDTO from './learningObjectives.request.dto';
import RequirementRequestDTO from './requirement.request.dto';

class UpdateCourseEntrollmentCriteriaCommand
  implements IRequest<Result<void, ErrorResult>>
{
  constructor(
    public readonly idCourse: string,
    public readonly idInstructor: string,
    public readonly requirements: RequirementRequestDTO[],
    public readonly intendedLearners: IntendedLearnersRequestDTO[],
    public readonly learningObjectives: LearningObjectivesRequestDTO[]
  ) {}
}

export default UpdateCourseEntrollmentCriteriaCommand;
