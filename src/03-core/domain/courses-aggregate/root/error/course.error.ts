import { ErrorResult } from '@domain/abstract/result-abstract';

class CourseErrors {
  static readonly EMPTY_REQUIREMENTS = (): ErrorResult => {
    return new ErrorResult(
      'COURSE.ENROLLMENT.REQUIREMENTS',
      'There must be at least one requirement.',
      400
    );
  };

  static readonly EMPTY_INTENDED_LEARNERS = (): ErrorResult => {
    return new ErrorResult(
      'COURSE.ENROLLMENT.INTENDED_LEARNERS',
      'There must be at least one intended learner.',
      400
    );
  };

  static readonly EMPTY_LEARNING_OBJECTIVES = (): ErrorResult => {
    return new ErrorResult(
      'COURSE.ENROLLMENT.LEARNING_OBJECTIVES',
      'There must be at least one learning objective.',
      400
    );
  };

  static readonly EMPTY_IMG = (): ErrorResult => {
    return new ErrorResult('COURSE.IMG', 'There must be an image.', 400);
  };
  static readonly EMPTY_VIDEO = (): ErrorResult => {
    return new ErrorResult('COURSE.VIDEO', 'There must be an video.', 400);
  };
}

export default CourseErrors;
