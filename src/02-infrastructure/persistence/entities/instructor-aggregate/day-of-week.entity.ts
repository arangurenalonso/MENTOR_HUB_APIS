import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import InstructorAvailabilityEntity from './intructor-availability.entity';

@Entity('day_of_week')
class DayOfWeekEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, nullable: false })
  name!: string;

  @Column({ type: 'int', nullable: false })
  index!: number;

  @OneToMany(
    () => InstructorAvailabilityEntity,
    (availability) => availability.dayOfWeek
  )
  availability!: InstructorAvailabilityEntity[];
}

export default DayOfWeekEntity;
