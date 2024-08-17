import AuthController from '@rest/controller/auth.controller';
import { Router } from 'express';
import LoginValidation from './validator/login.validator';
import RegisterValidation from './validator/register.validator';
import { inject, injectable } from 'inversify';
import TYPES from '@config/inversify/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';
import ValidatorMiddleware from '@rest/middlewares/validator.middleware';
import GoogleSignUpValidation from './validator/social-provider-google';
import AuthorizationMiddleware from '@rest/middlewares/authorization.middleware';
import AuthenticationMiddleware from '@rest/middlewares/authentication.middleware';
@injectable()
export class AuthRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,

    @inject(TYPES.AuthenticationMiddleware)
    private readonly _authenticationMiddleware: AuthenticationMiddleware,
    @inject(TYPES.AuthorizationMiddleware)
    private readonly _authorizationMiddleware: AuthorizationMiddleware,
    @inject(TYPES.AuthController)
    private readonly _authController: AuthController
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.post(
      '/login',
      LoginValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.login)
    );
    this._router.post(
      '/register',
      RegisterValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.register)
    );
    this._router.post(
      '/social-provider/:provider',
      GoogleSignUpValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.socialProvider)
    );
    // this._router.post(
    //   '/verify',
    //   this._authenticationMiddleware.use,
    //   asyncHandlerMiddleware(this._authController.socialProvider)
    // );
    this._router.get(
      '/validate-email/:verificationEmailToken',
      asyncHandlerMiddleware(this._authController.confirmEmailVerification)
    );
    this._router.get(
      '/validate-token',
      this._authenticationMiddleware.use, // Reutiliza el middleware
      asyncHandlerMiddleware(this._authController.validateToken) // Nuevo método en el controlador
    );
  }
  get router(): Router {
    return this._router;
  }
}
export default AuthRoutes;
