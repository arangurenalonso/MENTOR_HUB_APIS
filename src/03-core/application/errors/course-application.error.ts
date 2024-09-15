import ErrorResult from '@domain/abstract/result-abstract/error';

class CourseApplicationErrors {
  static readonly COURSE_BELONGS_TO_OTHER_INSTRUCTOR = (
    courseId: string
  ): ErrorResult => {
    return new ErrorResult(
      'INSTRUCTOR.CourseBelongsToOther',
      `Course with ID '${courseId}' belongs to another instructor`,
      403
    );
  };
}

export default CourseApplicationErrors;
