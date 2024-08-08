import { Column, Entity, Index, OneToMany } from 'typeorm';
import UserEntity from './user.entity';
import BaseEntity from '../abstrations/base.entity';

@Entity({ name: 'time_zone' })
class TimeZoneEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  timeZoneStringId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description!: string;

  @Column({ type: 'int', nullable: false })
  offsetHours!: number;

  @Column({ type: 'int', nullable: false })
  offsetMinutes!: number;

  @Column({ type: 'boolean', nullable: false })
  isDaylightSavingTime!: boolean;

  @OneToMany(() => UserEntity, (user) => user.timeZone)
  users!: UserEntity[];
}

export default TimeZoneEntity;
