import { Router } from 'express';
import AuthRoutes from './auth/auth.router';
import { inject, injectable } from 'inversify';
import TYPES from '@config/inversify/identifiers';
import InstructorRoutes from './instructor/instructor.route';
import MasterRoutes from './master/masters.route';
import CourseRoutes from './course/course.route';

@injectable()
class ApiRouter {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.AuthRoutes) private readonly _authRoutes: AuthRoutes,

    @inject(TYPES.MasterRoutes) private readonly _masterRoutes: MasterRoutes,
    @inject(TYPES.InstructorRoutes)
    private readonly _instructorRoutes: InstructorRoutes,
    @inject(TYPES.CourseRoutes) private readonly _courseRoutes: CourseRoutes
  ) {
    this.init();
    this._router = this._router.bind(this);
  }

  private init(): void {
    this._router.use('/auth', this._authRoutes.router);
    this._router.use('/instructor', this._instructorRoutes.router);
    this._router.use('/master', this._masterRoutes.router);
    this._router.use('/course', this._courseRoutes.router);
  }
  get router(): Router {
    return this._router;
  }
}

export default ApiRouter;
