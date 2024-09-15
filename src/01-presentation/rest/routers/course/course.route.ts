import TYPES from '@config/inversify/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';
import ValidatorMiddleware from '@rest/middlewares/validator.middleware';
import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import AuthenticationMiddleware from '@rest/middlewares/authentication.middleware';
import AuthorizationMiddleware from '@rest/middlewares/authorization.middleware';
import AuthorizeModificationMiddleware from '@rest/middlewares/authorizeModification.middleware';
import CourseController from '../../controller/course.controller';
import CourseInformationValidation from './validator/course-information.validator';
import ImageUploadValidation from '@rest/middlewares/image-upload.middleware';
import VideoUploadValidation from '@rest/middlewares/video-upload.middleware';
import IdCoursePathParamValidator from './validator/id-course-path.validator';
import EnrollmentCriteriaValidation from './validator/enrollment-criteria.validator';

@injectable()
export class CourseRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.CourseController)
    private readonly _courseController: CourseController,
    @inject(TYPES.AuthorizeModificationMiddleware)
    private readonly _authorizeModificationMiddleware: AuthorizeModificationMiddleware,
    @inject(TYPES.AuthorizationMiddleware)
    private readonly _authorizationMiddleware: AuthorizationMiddleware,
    @inject(TYPES.AuthenticationMiddleware)
    private readonly _authenticationMiddleware: AuthenticationMiddleware,
    @inject(TYPES.ImageUploadValidation)
    private readonly _imageUploadValidation: ImageUploadValidation,
    @inject(TYPES.VideoUploadValidation)
    private readonly _videoUploadValidation: VideoUploadValidation
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.get(
      '/profile',
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(
        this._courseController.getCoursesByConnectedInstructor
      )
    );
    this._router.post(
      '',
      CourseInformationValidation,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._courseController.create)
    );
    this._router.put(
      '/:idCourse/publish',
      IdCoursePathParamValidator,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._courseController.publishCourse)
    );
    this._router.put(
      '/:idCourse/course-information',
      CourseInformationValidation,
      IdCoursePathParamValidator,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._courseController.updateCourseInformation)
    );
    this._router.put(
      '/:idCourse/enrollment-criteria',
      EnrollmentCriteriaValidation,
      IdCoursePathParamValidator,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(
        this._courseController.updateCourseEnrollmentCriteria
      )
    );
    this._router.post(
      '/:idCourse/image',
      this._imageUploadValidation.build({ fieldName: 'img' }),
      IdCoursePathParamValidator,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._courseController.updateImage)
    );
    this._router.post(
      '/:idCourse/promotional-video',
      this._videoUploadValidation.build({ fieldName: 'video' }),
      IdCoursePathParamValidator,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._courseController.updatePromotionalVideo)
    );
  }

  get router(): Router {
    return this._router;
  }
}
export default CourseRoutes;
