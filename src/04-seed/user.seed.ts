import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import IPasswordService from '@application/contracts/Ipassword.service';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import NaturalPersonEntity from '@persistence/entities/person-aggreagte/natural_person.entity';
import PersonEntity from '@persistence/entities/person-aggreagte/person.entity';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';

@injectable()
class UserSeeder {
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: DataSource,
    @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
  ) {
    this.dataSource = dataSource;
  }

  async seedAdminUser(): Promise<void> {
    // await this.dataSource.transaction(async (transactionalEntityManager) => {
    //   const userRepository =
    //     transactionalEntityManager.getRepository(UserEntity);
    //   const email = 'mentor-hub-admin@mentorhub.com';
    //   const adminExists = await userRepository.findOneBy({
    //     email: email,
    //   });
    //   if (!adminExists) {
    //     const adminUser = new UserEntity();
    //     const passwordHash = await this._passwordService.encrypt(
    //       'MentoHub@dmin123'
    //     );
    //     adminUser.id = '18d17416-928d-4d59-9e00-f305b9935984';
    //     adminUser.email = email;
    //     adminUser.passwordHash = passwordHash;
    //     adminUser.emailValidated = true;
    //     await userRepository.save(adminUser);
    //     const userRoleRepository =
    //       transactionalEntityManager.getRepository(UserRoleEntity);
    //     const userRole = new UserRoleEntity();
    //     userRole.idUser = adminUser.id;
    //     userRole.idRol = RoleEnum.ADMIN.id;
    //     await userRoleRepository.save(userRole);
    //     const personRepository =
    //       transactionalEntityManager.getRepository(PersonEntity);
    //     const naturalPersonRepository =
    //       transactionalEntityManager.getRepository(NaturalPersonEntity);
    //     // Create and save the general person entity
    //     const person = new PersonEntity();
    //     person.personType = 'Admin';
    //     person.idUser = adminUser.id;
    //     await personRepository.save(person);
    //     // Create and save the natural person entity using the same ID
    //     const naturalPerson = new NaturalPersonEntity();
    //     naturalPerson.id = person.id; // Shared ID
    //     naturalPerson.name = 'Admin';
    //     naturalPerson.person = person;
    //     await naturalPersonRepository.save(naturalPerson);
    //     console.log('Admin user seeded successfully.');
    //   } else {
    //     console.log('Admin user already exists.');
    //   }
    // });
  }
}

export default UserSeeder;
