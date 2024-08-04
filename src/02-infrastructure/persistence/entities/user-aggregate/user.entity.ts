import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import UserRoleEntity from './user-role.entity';
import BaseEntity from '../abstrations/base.entity';
import PersonEntity from '../person-aggreagte/person.entity';

@Entity('users')
class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;
  @Column({ type: 'varchar', length: 100, nullable: false })
  passwordHash!: string;

  // @Column({ type: 'boolean', default: false })
  // emailValidated: boolean = false;

  @OneToOne(() => PersonEntity, (person) => person.user)
  person?: PersonEntity;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles!: UserRoleEntity[];
}
export default UserEntity;
