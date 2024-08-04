import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import UserRoleEntity from './user-role.entity';

@Entity({ name: 'role' })
class RoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  description!: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles!: UserRoleEntity[];
}
export default RoleEntity;
