import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import UserEntity from './user.entity';
import RoleEntity from './role.entity';

@Entity({ name: 'user_roles' })
class UserRoleEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  idUser!: string;

  @Column({ type: 'uuid', nullable: false })
  idRol!: string;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({
    name: 'idUser',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_UserRole_User',
  })
  user!: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({
    name: 'idRol',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_UserRole_Role',
  })
  role!: RoleEntity;
}
export default UserRoleEntity;
