const TYPES = {
  Application: Symbol.for('Application'),
  ExpressServer: Symbol.for('ExpressServer'),
  JobServer: Symbol.for('JobServer'),
  Router: Symbol.for('Router'),
  Mediator: Symbol.for('Mediator'),
  TypeORMInitializer: Symbol.for('TypeORMInitializer'),
  Environment: Symbol.for('EnvironmentConfig'),
  DataSource: Symbol.for('DataSource'),
  EntityManager: Symbol.for('EntityManager'),
  Multer: Symbol.for('Multer'),

  CronService: Symbol.for('CronService'),
  //Jobs
  OutboxMessageJob: Symbol.for('OutboxMessageJob'),
  // Middlewares
  AuthenticationMiddleware: Symbol.for('AuthenticationMiddleware'),
  AuthorizationMiddleware: Symbol.for('AuthorizationMiddleware'),
  ImageUploadValidation: Symbol.for('ImageUploadValidation'),
  VideoUploadValidation: Symbol.for('VideoUploadValidation'),
  AuthorizeModificationMiddleware: Symbol.for(
    'AuthorizeModificationMiddleware'
  ),
  // Routers
  ApiRouter: Symbol.for('ApiRouter'),
  AuthRoutes: Symbol.for('AuthRoutes'),
  MasterRoutes: Symbol.for('MasterRoutes'),
  InstructorRoutes: Symbol.for('InstructorRoutes'),
  CourseRoutes: Symbol.for('CourseRoutes'),
  // Controllers
  AuthController: Symbol.for('AuthController'),
  InstructorController: Symbol.for('InstructorController'),
  MasterController: Symbol.for('MasterController'),
  CourseController: Symbol.for('CourseController'),
  // UseCases
  //Services
  IPasswordService: Symbol.for('IPasswordService'),
  ITokenService: Symbol.for('ITokenService'),
  IEmailService: Symbol.for('IEmailService'),
  IS3Service: Symbol.for('IS3Service'),
  // Repositories
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IBaseRepository: Symbol.for('IBaseRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  IPersonRepository: Symbol.for('IPersonRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  InstructorRepository: Symbol.for('InstructorRepository'),
  IOutboxMessageRepository: Symbol.for('IOutboxMessageRepository'),
  ICourseRepository: Symbol.for('ICourseRepository'),
  //SEED
  UserSeeder: Symbol.for('UserSeeder'),
  RoleSeeder: Symbol.for('RoleSeeder'),
  SocialMediaSeeder: Symbol.for('SocialMediaSeeder'),
  TimeZoneSeeder: Symbol.for('TimeZoneSeeder'),
  TimeOptionSeeder: Symbol.for('TimeOptionSeeder'),
  DayOfWeekSeeder: Symbol.for('DayOfWeekSeeder'),
  CategorySeeder: Symbol.for('CategorySeeder'),
  LevelSeeder: Symbol.for('LevelSeeder'),
};
export default TYPES;
