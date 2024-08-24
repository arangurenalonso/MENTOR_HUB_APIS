import TYPES from '@config/inversify/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';
import ValidatorMiddleware from '@rest/middlewares/validator.middleware';
import { Router } from 'express';
import { injectable, inject } from 'inversify';
import InstructorController from '@rest/controller/instructor.controller';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import AvailabilityValidation from './validator/availability.validator';
import UpdateProfileValidation from './validator/updateAboutValidation';
import AuthenticationMiddleware from '@rest/middlewares/authentication.middleware';
import AuthorizationMiddleware from '@rest/middlewares/authorization.middleware';
import AuthorizeModificationMiddleware from '@rest/middlewares/authorizeModification.middleware';

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.InstructorController)
    private readonly _instructorController: InstructorController,
    @inject(TYPES.AuthorizeModificationMiddleware)
    private readonly _authorizeModificationMiddleware: AuthorizeModificationMiddleware,
    @inject(TYPES.AuthorizationMiddleware)
    private readonly _authorizationMiddleware: AuthorizationMiddleware,
    @inject(TYPES.AuthenticationMiddleware)
    private readonly _authenticationMiddleware: AuthenticationMiddleware
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.get(
      '/profile',
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._instructorController.getConnectedInstructor)
    );

    this._router.post(
      '/profile',
      this._authenticationMiddleware.use,
      asyncHandlerMiddleware(this._instructorController.createProfile)
    );

    this._router.put(
      '/availability/:idInstructor',
      AvailabilityValidation,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([RoleEnum.INSTRUCTOR.description]),
      asyncHandlerMiddleware(this._instructorController.updateAvailability)
    );
    this._router.put(
      '/profile/:idInstructor',
      UpdateProfileValidation,
      ValidatorMiddleware.validate,
      this._authenticationMiddleware.use,
      this._authorizationMiddleware.build([
        RoleEnum.INSTRUCTOR.description,
        RoleEnum.ADMIN.description,
      ]),
      this._authorizeModificationMiddleware.build(
        [RoleEnum.ADMIN.description],
        'idInstructor'
      ),
      asyncHandlerMiddleware(this._instructorController.updateProfile)
    );
  }

  get router(): Router {
    return this._router;
  }
}
export default InstructorRoutes;
