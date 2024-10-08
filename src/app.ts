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
import TimeZoneSeeder from '@config/seed/time-zone.seed';
import DayOfWeekSeeder from '@config/seed/dayOfWeek.seed';
import TimeOptionSeeder from '@config/seed/time-option.seed';
import CategorySeeder from '@config/seed/category.seed';
import LevelSeeder from '@config/seed/level.seed';

async function executeSeed(container: Container) {
  const roleSeeder = container.get<RoleSeeder>(TYPES.RoleSeeder);
  const userSeeder = container.get<UserSeeder>(TYPES.UserSeeder);
  const timeZoneSeeder = container.get<TimeZoneSeeder>(TYPES.TimeZoneSeeder);
  const socialMediaSeeder = container.get<SocialMediaSeeder>(
    TYPES.SocialMediaSeeder
  );
  const dayOfWeekSeeder = container.get<DayOfWeekSeeder>(TYPES.DayOfWeekSeeder);
  const timeOptionSeeder = container.get<TimeOptionSeeder>(
    TYPES.TimeOptionSeeder
  );
  const categorySeeder = container.get<CategorySeeder>(TYPES.CategorySeeder);
  const LevelSeeder = container.get<LevelSeeder>(TYPES.LevelSeeder);

  await Promise.all([
    roleSeeder.seedData(),
    timeZoneSeeder.seedData(),
    socialMediaSeeder.seedData(),
    dayOfWeekSeeder.seedData(),
    timeOptionSeeder.seedData(),
    categorySeeder.seedData(),
    userSeeder.seedAdminUser(),
    LevelSeeder.seedData(),
  ]);
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
// delete from email;
// delete from legal_person;
// delete from  instructor_social_media;
// delete from instructor_availability;
// delete from instructor;
// delete from natural_person;
// delete from person;
// delete from user_auth_providers;
// delete from user_roles;
// delete from users;

// delete from time_zone;
// delete from time_option;
// delete from day_of_week;
// delete from social_media;
// delete from sub_category;
// delete from category;
// delete from level;

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
