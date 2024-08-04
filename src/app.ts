import 'reflect-metadata';
import ExpressServer from '@rest/express.server';
import DependencyContainer from '@config/inversify/dependency-container';
import TYPES from '@config/inversify/identifiers';
import InversifyResolver from '@config/inversify/inversify-resolver';
import TypeORMInitializer from '@persistence/config/typeorm.config';
import { mediatorSettings } from 'mediatr-ts';
import JobServer from '@job/job.server';
import UserSeeder from './04-seed/user.seed';
import RoleSeeder from './04-seed/role.seed';
import { Container } from 'inversify';

async function executeSeed(container: Container) {
  const roleSeeder = container.get<RoleSeeder>(TYPES.RoleSeeder);
  await roleSeeder.seedRoles();
  const userSeeder = container.get<UserSeeder>(TYPES.UserSeeder);
  await userSeeder.seedAdminUser();
}

async function main() {
  const dependencyContainer = new DependencyContainer();

  const container = dependencyContainer.container;
  mediatorSettings.resolver = new InversifyResolver(container);

  const dataBase = container.get<TypeORMInitializer>(TYPES.TypeORMInitializer);
  const expressServer = container.get<ExpressServer>(TYPES.ExpressServer);

  const jobServer = container.get<JobServer>(TYPES.JobServer);

  jobServer.initialize();
  await dataBase.initialize();
  await expressServer.start();
  await executeSeed(container);
}

(async () => {
  await main();
})();

// Generalización y Especialización de BD
