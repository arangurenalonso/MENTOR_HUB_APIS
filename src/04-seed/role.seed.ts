import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';
import RoleEntity from '@persistence/entities/user-aggregate/role.entity';

@injectable()
class RoleSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedRoles(): Promise<void> {
    const roleRepository = this.dataSource.getRepository(RoleEntity);

    for (const key of Object.keys(RoleEnum) as (keyof typeof RoleEnum)[]) {
      const role = RoleEnum[key];
      const roleExists = await roleRepository.findOneBy({
        description: role.description,
      });
      if (!roleExists) {
        const newRole = roleRepository.create(role);
        await roleRepository.save(newRole);
        console.log(`Role ${role.description} seeded successfully.`);
      } else {
        console.log(`Role ${role.description} already exists.`);
      }
    }
  }
}

export default RoleSeeder;
