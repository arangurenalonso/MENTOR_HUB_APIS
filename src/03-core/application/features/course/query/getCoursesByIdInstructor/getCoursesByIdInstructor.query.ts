import { ErrorResult } from '@domain/abstract/result-abstract';
import { CourseDomainProperties } from '@domain/courses-aggregate/root/course.domain';
import { IRequest } from 'mediatr-ts';
import { Result } from 'neverthrow';

class GetCoursesByIdInstructorQuery
  implements IRequest<Result<CourseDomainProperties[], ErrorResult>>
{
  constructor(public readonly idInstructor: string) {}
}

export default GetCoursesByIdInstructorQuery;
