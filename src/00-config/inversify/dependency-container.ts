import express, { Application, Router } from 'express';
import { Container } from 'inversify';
import TYPES from './identifiers';
import AuthController from '@rest/controller/auth.controller';
import ExpressServer from '@rest/express.server';
import ApiRouter from '@rest/routers/api.router';
import AuthRoutes from '@rest/routers/auth/auth.router';
import Environment from '@config/enviroment';
import { INotificationHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import RegisterCommand from '@application/features/auth/command/register/register.command';
import { DataSource } from 'typeorm';
import TypeORMInitializer from '@persistence/config/typeorm.config';
import IEmailService from '@application/contracts/IEmail.service';
import IPasswordService from '@application/contracts/Ipassword.service';
import ITokenService from '@application/contracts/IToken.service';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import IOutboxMessageRepository from '@domain/cross-cutting-concern/outbox/repository/IOutboxMessage.repository';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UnitOfWork from '@persistence/repositories/commun/UnitOfWork';
import UserRepository from '@persistence/repositories/user.repository.impl';
import OutboxMessageRepository from '@persistence/repositories/outbox-message.repository.impl';
import UserCreatedDomainEventHandler from '@application/features/auth/command/register/user-create.domain-event-handler';
import UserCreatedDomainEvent from '@domain/user-aggregate/root/events/user-created.domain-event';
import RegisterCommandHandler from '@application/features/auth/command/register/register.command.handler';
import LoginCommand from '@application/features/auth/command/login/login.command';
import LoginCommandHandler from '@application/features/auth/command/login/login.command.handler';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import AuthenticationMiddleware from '@rest/middlewares/authentication.middleware';
import PasswordService from '@service/password.service.impl';
import TokenService from '@service/token.service.impl';
import EmailService from '@service/email.service';
import OutboxMessageJob from '@job/cronJobs/outbox-message.job';
import JobServer from '@job/job.server';
import ExecOutboxMessagesCommand from '@application/features/outboxMessages/command/exec-outboxMessages.command';
import ExecOutboxMessagesCommandHandler from '@application/features/outboxMessages/command/exec-outboxMessages.command.handler';
import CronService from '@job/cron.service';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import PersonRepository from '@persistence/repositories/person.repository.impl';
import RoleSeeder from '@config/seed/role.seed';
import InstructorController from '@rest/controller/instructor.controller';
import InstructorRoutes from '@rest/routers/instructor/instructor.route';
import AuthorizationMiddleware from '@rest/middlewares/authorization.middleware';
import IInstructorRepository from '@domain/intructor-aggregate/root/repository/instructor.repository';
import InstructorRepository from '@persistence/repositories/Instructor.repository.impl';
import SocialMediaSeeder from '@config/seed/social-media.seed';
import UserSeeder from '@config/seed/user.seed';
import CreateInstructorProfileCommand from '@application/features/instructor/command/createProfile/create-profile.command';
import CreateInstructorProfileCommandHandler from '@application/features/instructor/command/createProfile/create-profile.command.handler';
import TimeZoneSeeder from '@config/seed/time-zone.seed';
import DayOfWeekSeeder from '@config/seed/dayOfWeek.seed';
import TimeOptionSeeder from '@config/seed/time-option.seed';
import UpdateInstructorAvailabilityCommand from '@application/features/instructor/command/updateAvailability/updateAvailability.command';
import UpdateInstructorAvailabilityCommandhandler from '@application/features/instructor/command/updateAvailability/updateAvailability.command.handler';
import SocialProviderCommand from '@application/features/auth/command/social-provider/social-provider.command';
import SocialProviderCommandHandler from '@application/features/auth/command/social-provider/social-provider.command.handler';
import AuthenticationResultQuery from '@application/features/auth/query/authentication-result/authentication-result.query';
import AuthenticationResultQueryHandler from '@application/features/auth/query/authentication-result/authentication-result.query.handler';
import ConfirmEmailVerificationCommandHandler from '@application/features/auth/command/confirmEmailVerification/confirmEmailVerification.command.handler';
import ConfirmEmailVerificationCommand from '@application/features/auth/command/confirmEmailVerification/confirmEmailVerification.command';
import UpdateAboutCommand from '@application/features/instructor/command/updateAbout/updateAbout.command';
import UpdateAboutCommandhandler from '@application/features/instructor/command/updateAbout/updateAbout.command.handler';
import GetInstructorByIdQuery from '@application/features/instructor/query/getInstructorById/getInstructorById.query';
import GetInstructorByIdQueryHandler from '@application/features/instructor/query/getInstructorById/getInstructorById.query.handler';
import AuthorizeModificationMiddleware from '@rest/middlewares/authorizeModification.middleware';
import CategorySeeder from '@config/seed/category.seed';
import LevelSeeder from '@config/seed/level.seed';
import ICourseRepository from '@domain/courses-aggregate/root/repositories/ICourse.repository';
import CourseRepository from '@persistence/repositories/course.repository.impl';
import MasterRoutes from '@rest/routers/master/masters.route';
import MasterController from '@rest/controller/master.controller';
import GetAllLevelQuery from '@application/features/master/query/getAllLevel/getAllLevel.query';
import GetAllLevelQueryHandler from '@application/features/master/query/getAllLevel/getAllLevel.query.handler';
import GetAllCategoriesQueryHandler from '@application/features/master/query/getAllCategories/getAllCategories.query.handler';
import GetAllCategoriesQuery from '@application/features/master/query/getAllCategories/getAllCategoriesquery';
import GetSubCategoriesByIdCategoryQuery from '@application/features/master/query/getSubCategoriesByIdCategory/getSubCategoriesByIdCategory';
import GetSubCategoriesByIdCategoryQueryHandler from '@application/features/master/query/getSubCategoriesByIdCategory/getSubCategoriesByIdCategory.query.handler';
import CourseController from '@rest/controller/course.controller';
import CourseRoutes from '@rest/routers/course/course.route';
import CreateCourseCommandHandler from '@application/features/course/command/createCourse/createCourse.command.handler';
import CreateCourseCommand from '@application/features/course/command/createCourse/createCourse.command';
import IS3Service from '@application/contracts/IS3.service';
import S3Service from '@service/s3.service';
import multer, { Multer } from 'multer';
import UpdatePhotoCourseCommand from '@application/features/course/command/updatePhotoCourse/updatePhotoCourse.command';
import UpdatePhotoCourseCommandHandler from '@application/features/course/command/updatePhotoCourse/updatePhotoCourse.command.handler';
import ImageUploadValidation from '@rest/middlewares/image-upload.middleware';
import VideoUploadValidation from '@rest/middlewares/video-upload.middleware';
import UpdatePromotionalVideoCourseCommand from '@application/features/course/command/updatePromotionalVideoCourse/updatePromotionalVideoCourse.command';
import UpdatePromotionalVideoCourseCommandHandler from '@application/features/course/command/updatePromotionalVideoCourse/updatePromotionalVideoCourse.command.handler';
import GetCoursesByIdInstructorQuery from '@application/features/course/query/getCoursesByIdInstructor/getCoursesByIdInstructor.query';
import GetCoursesByIdInstructorQueryHandler from '@application/features/course/query/getCoursesByIdInstructor/getCoursesByIdInstructor.query.handler';

class DependencyContainer {
  private readonly _container: Container;

  constructor() {
    this._container = new Container();
    this.setupDependencies();
  }

  private setupDependencies(): void {
    this.bindMiddelwares();
    this.bindDatabase();
    this.bindDomainEvents();
    this.bindServices();
    this.bindJobs();
    this.bindRepositories();
    this.bindUseCase();
    this.bindControllers();
    this.bindRouters();
    this.bindCore();
    this.bindServer();
    this.bindSeeder();
  }

  private bindSeeder(): void {
    this._container.bind<UserSeeder>(TYPES.UserSeeder).to(UserSeeder);
    this._container.bind<RoleSeeder>(TYPES.RoleSeeder).to(RoleSeeder);
    this._container
      .bind<SocialMediaSeeder>(TYPES.SocialMediaSeeder)
      .to(SocialMediaSeeder);
    this._container
      .bind<TimeZoneSeeder>(TYPES.TimeZoneSeeder)
      .to(TimeZoneSeeder);
    this._container
      .bind<TimeOptionSeeder>(TYPES.TimeOptionSeeder)
      .to(TimeOptionSeeder);
    this._container
      .bind<DayOfWeekSeeder>(TYPES.DayOfWeekSeeder)
      .to(DayOfWeekSeeder);

    this._container
      .bind<CategorySeeder>(TYPES.CategorySeeder)
      .to(CategorySeeder);

    this._container.bind<LevelSeeder>(TYPES.LevelSeeder).to(LevelSeeder);
  }

  private bindJobs(): void {
    this._container
      .bind<OutboxMessageJob>(TYPES.OutboxMessageJob)
      .to(OutboxMessageJob);
  }
  private bindMiddelwares(): void {
    this._container
      .bind<AuthenticationMiddleware>(TYPES.AuthenticationMiddleware)
      .to(AuthenticationMiddleware);
    this._container
      .bind<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware)
      .to(AuthorizationMiddleware);

    this._container
      .bind<ImageUploadValidation>(TYPES.ImageUploadValidation)
      .to(ImageUploadValidation);

    this._container
      .bind<VideoUploadValidation>(TYPES.VideoUploadValidation)
      .to(VideoUploadValidation);

    this._container
      .bind<AuthorizeModificationMiddleware>(
        TYPES.AuthorizeModificationMiddleware
      )
      .to(AuthorizeModificationMiddleware);
  }
  private bindCore(): void {
    this._container.bind<Multer>(TYPES.Multer).toDynamicValue(() => multer());
    this._container
      .bind<Application>(TYPES.Application)
      .toConstantValue(express());

    this._container
      .bind<Router>(TYPES.Router)
      .toDynamicValue(() => express.Router());

    this._container
      .bind<Mediator>(TYPES.Mediator)
      .toConstantValue(new Mediator());
    this._container
      .bind<CronService>(TYPES.CronService)
      .toConstantValue(new CronService());

    this._container.bind<Environment>(TYPES.Environment).to(Environment);
  }
  private bindDomainEvents(): void {
    this._container
      .bind<INotificationHandler<UserCreatedDomainEvent>>(
        'UserCreatedDomainEventHandler'
      )
      .to(UserCreatedDomainEventHandler);
  }

  private bindServices(): void {
    this._container
      .bind<IPasswordService>(TYPES.IPasswordService)
      .to(PasswordService);

    this._container.bind<ITokenService>(TYPES.ITokenService).to(TokenService);
    this._container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
    this._container.bind<IS3Service>(TYPES.IS3Service).to(S3Service);
  }
  private bindRepositories(): void {
    this._container.bind<IUnitOfWork>(TYPES.IUnitOfWork).to(UnitOfWork);
    this._container
      .bind<IOutboxMessageRepository>(TYPES.IOutboxMessageRepository)
      .to(OutboxMessageRepository);

    this._container
      .bind<IUserRepository>(TYPES.IUserRepository)
      .to(UserRepository);

    this._container
      .bind<IPersonRepository>(TYPES.IPersonRepository)
      .to(PersonRepository);

    this._container
      .bind<IInstructorRepository>(TYPES.InstructorRepository)
      .to(InstructorRepository);

    this._container
      .bind<ICourseRepository>(TYPES.ICourseRepository)
      .to(CourseRepository);
  }
  private bindControllers(): void {
    this._container
      .bind<AuthController>(TYPES.AuthController)
      .to(AuthController);
    this._container
      .bind<InstructorController>(TYPES.InstructorController)
      .to(InstructorController);

    this._container
      .bind<MasterController>(TYPES.MasterController)
      .to(MasterController);
    this._container
      .bind<CourseController>(TYPES.CourseController)
      .to(CourseController);
  }
  private bindRouters(): void {
    this._container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
    this._container
      .bind<InstructorRoutes>(TYPES.InstructorRoutes)
      .to(InstructorRoutes);
    this._container.bind<ApiRouter>(TYPES.ApiRouter).to(ApiRouter);

    this._container.bind<MasterRoutes>(TYPES.MasterRoutes).to(MasterRoutes);
    this._container.bind<CourseRoutes>(TYPES.CourseRoutes).to(CourseRoutes);
  }
  private bindUseCase(): void {
    const handlers = [
      { command: LoginCommand, handler: LoginCommandHandler },
      { command: RegisterCommand, handler: RegisterCommandHandler },
      { command: SocialProviderCommand, handler: SocialProviderCommandHandler },
      {
        command: AuthenticationResultQuery,
        handler: AuthenticationResultQueryHandler,
      },
      {
        command: ConfirmEmailVerificationCommand,
        handler: ConfirmEmailVerificationCommandHandler,
      },
      {
        command: CreateInstructorProfileCommand,
        handler: CreateInstructorProfileCommandHandler,
      },
      {
        command: UpdateInstructorAvailabilityCommand,
        handler: UpdateInstructorAvailabilityCommandhandler,
      },
      { command: UpdateAboutCommand, handler: UpdateAboutCommandhandler },
      {
        command: GetInstructorByIdQuery,
        handler: GetInstructorByIdQueryHandler,
      },
      { command: GetAllLevelQuery, handler: GetAllLevelQueryHandler },
      { command: GetAllCategoriesQuery, handler: GetAllCategoriesQueryHandler },
      {
        command: GetSubCategoriesByIdCategoryQuery,
        handler: GetSubCategoriesByIdCategoryQueryHandler,
      },
      {
        command: CreateCourseCommand,
        handler: CreateCourseCommandHandler,
      },
      {
        command: UpdatePhotoCourseCommand,
        handler: UpdatePhotoCourseCommandHandler,
      },
      {
        command: UpdatePromotionalVideoCourseCommand,
        handler: UpdatePromotionalVideoCourseCommandHandler,
      },
      {
        command: GetCoursesByIdInstructorQuery,
        handler: GetCoursesByIdInstructorQueryHandler,
      },
    ];

    handlers.forEach(({ command, handler }) => {
      this._container
        .bind<IRequestHandler<any, Result<any, ErrorResult>>>(command.name)
        .to(handler);
    });

    this._container
      .bind<IRequestHandler<ExecOutboxMessagesCommand, void>>(
        'ExecOutboxMessagesCommand'
      )
      .to(ExecOutboxMessagesCommandHandler);

    // this._container
    //   .bind<
    //     IRequestHandler<LoginCommand, Result<AuthenticationResult, ErrorResult>>
    //   >('LoginCommand')
    //   .to(LoginCommandHandler);
  }
  private bindDatabase(): void {
    this._container
      .bind<TypeORMInitializer>(TYPES.TypeORMInitializer)
      .to(TypeORMInitializer)
      .inSingletonScope();

    this._container
      .bind<DataSource>(TYPES.DataSource)
      .toDynamicValue(() => {
        const dataBase = this._container.get<TypeORMInitializer>(
          TYPES.TypeORMInitializer
        );
        return dataBase.dataSource;
      })
      .inSingletonScope();
  }
  private bindServer(): void {
    this._container.bind<ExpressServer>(TYPES.ExpressServer).to(ExpressServer);
    this._container.bind<JobServer>(TYPES.JobServer).to(JobServer);
  }
  get container(): Container {
    return this._container;
  }
}
export default DependencyContainer;
