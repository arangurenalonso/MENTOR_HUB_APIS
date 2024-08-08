import express, { Application, Router } from 'express';
import { Container } from 'inversify';
import TYPES from './identifiers';
import AuthController from '@rest/controller/auth.controller';
import ExpressServer from '@rest/express.server';
import ApiRouter from '@rest/routers/api.router';
import AuthRoutes from '@rest/routers/auth/auth.router';
import Environment from '@config/enviroment';
import { INotificationHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import AuthenticationResult from '@application/models/AuthenticationResult';
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
  }
  private bindCore(): void {
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
  }
  private bindControllers(): void {
    this._container
      .bind<AuthController>(TYPES.AuthController)
      .to(AuthController);
    this._container
      .bind<InstructorController>(TYPES.InstructorController)
      .to(InstructorController);
  }
  private bindRouters(): void {
    this._container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
    this._container
      .bind<InstructorRoutes>(TYPES.InstructorRoutes)
      .to(InstructorRoutes);
    this._container.bind<ApiRouter>(TYPES.ApiRouter).to(ApiRouter);
  }
  private bindUseCase(): void {
    this._container
      .bind<
        IRequestHandler<LoginCommand, Result<AuthenticationResult, ErrorResult>>
      >('LoginCommand')
      .to(LoginCommandHandler);

    this._container
      .bind<
        IRequestHandler<
          RegisterCommand,
          Result<AuthenticationResult, ErrorResult>
        >
      >('RegisterCommand')
      .to(RegisterCommandHandler);

    this._container
      .bind<
        IRequestHandler<
          CreateInstructorProfileCommand,
          Result<AuthenticationResult, ErrorResult>
        >
      >('CreateInstructorProfileCommand')
      .to(CreateInstructorProfileCommandHandler);

    this._container
      .bind<IRequestHandler<ExecOutboxMessagesCommand, void>>(
        'ExecOutboxMessagesCommand'
      )
      .to(ExecOutboxMessagesCommandHandler);
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
