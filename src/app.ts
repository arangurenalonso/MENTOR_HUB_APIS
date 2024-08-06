import 'reflect-metadata';
import ExpressServer from '@rest/express.server';
import DependencyContainer from '@config/inversify/dependency-container';
import TYPES from '@config/inversify/identifiers';
import InversifyResolver from '@config/inversify/inversify-resolver';
import TypeORMInitializer from '@persistence/config/typeorm.config';
import { mediatorSettings } from 'mediatr-ts';
import JobServer from '@job/job.server';
import UserSeeder from './00-config/seed/user.seed';
import RoleSeeder from './00-config/seed/role.seed';
import { Container } from 'inversify';
import SocialMediaSeeder from '@config/seed/social-media.seed';

async function executeSeed(container: Container) {
  const roleSeeder = container.get<RoleSeeder>(TYPES.RoleSeeder);
  await roleSeeder.seedRoles();

  const userSeeder = container.get<UserSeeder>(TYPES.UserSeeder);
  await userSeeder.seedAdminUser();

  const socialMediaSeeder = container.get<SocialMediaSeeder>(
    TYPES.SocialMediaSeeder
  );
  await socialMediaSeeder.seed();
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
/**
 * Soft skill:
 * ---------------------------
 * Comunication
 * Teamwork
 * Critical thinking
 * problem solving
 * creativity
 * ñeadership
 * work ethic
 * conflict resolution
 * interpersonal skills
 * negotiation
 * emotional intelligence
 * attention to detail
 * decision making
 * stress management
 * patience
 * organization skills
 * active listening
 * public speaking
 * customer service
 * collaboration
 * self motivation
 * multitasking
 * empathy
 * networking
 * flexibility
 * mentoring
 * persuasion
 * delegation
 * innovation
 * tram building
 * responsibility
 * professionalism
 * assertiveness
 * cultural awareness
 * positive attitude
 * resilience
 * open-mindedness
 * tolerance
 * motivating others
 * givind an receiving feedback
 * conflic management
 * worklife balance
 * goal setting
 * initiatieve
 * self discipline
 * independence
 * learning agility
 * coaching
 */
