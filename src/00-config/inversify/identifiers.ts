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

  CronService: Symbol.for('CronService'),
  //Jobs
  OutboxMessageJob: Symbol.for('OutboxMessageJob'),
  // Middlewares
  AuthenticationMiddleware: Symbol.for('AuthenticationMiddleware'),
  AuthorizationMiddleware: Symbol.for('AuthorizationMiddleware'),
  // Routers
  ApiRouter: Symbol.for('ApiRouter'),
  AuthRoutes: Symbol.for('AuthRoutes'),
  InstructorRoutes: Symbol.for('InstructorRoutes'),
  // Controllers
  AuthController: Symbol.for('AuthController'),
  InstructorController: Symbol.for('InstructorController'),
  // UseCases
  //Services
  IPasswordService: Symbol.for('IPasswordService'),
  ITokenService: Symbol.for('ITokenService'),
  IEmailService: Symbol.for('IEmailService'),
  // Repositories
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IBaseRepository: Symbol.for('IBaseRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  IPersonRepository: Symbol.for('IPersonRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  InstructorRepository: Symbol.for('InstructorRepository'),
  IOutboxMessageRepository: Symbol.for('IOutboxMessageRepository'),
  //SEED
  UserSeeder: Symbol.for('UserSeeder'),
  RoleSeeder: Symbol.for('RoleSeeder'),
  SocialMediaSeeder: Symbol.for('SocialMediaSeeder'),
};
export default TYPES;
