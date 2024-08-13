import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import UserEntity from './user.entity';

@Entity({ name: 'user_auth_providers' })
class AuthProviderEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  idUser!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  provider!: string; // Por ejemplo, 'google', 'facebook', 'email_password'

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  uidProvider!: string; // El UID proporcionado por el proveedor (Google, Facebook, etc.)

  @ManyToOne(() => UserEntity, (user) => user.authProviders)
  @JoinColumn({
    name: 'idUser',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_UserAuthProvider_User',
  })
  user!: UserEntity;
}

export default AuthProviderEntity;
