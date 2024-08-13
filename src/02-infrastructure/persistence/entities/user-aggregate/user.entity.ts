import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import UserRoleEntity from './user-role.entity';
import BaseEntity from '../abstrations/base.entity';
import PersonEntity from '../person-aggreagte/person.entity';
import TimeZoneEntity from './time-zone.entity';
import AuthProviderEntity from './user-auth-provider.entity';

@Entity('users')
class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  passwordHash?: string;

  // @Column({ type: 'boolean', default: false })
  // emailValidated: boolean = false;

  @Column({ type: 'uuid', nullable: false })
  idTimeZone!: string;

  @ManyToOne(() => TimeZoneEntity, (timeZone) => timeZone.users)
  @JoinColumn({
    name: 'idTimeZone',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_User_TimeZone',
  })
  timeZone!: TimeZoneEntity;

  @OneToOne(() => PersonEntity, (person) => person.user)
  person?: PersonEntity;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles!: UserRoleEntity[];
  @OneToMany(() => AuthProviderEntity, (authProvider) => authProvider.user)
  authProviders!: AuthProviderEntity[];
}
export default UserEntity;
