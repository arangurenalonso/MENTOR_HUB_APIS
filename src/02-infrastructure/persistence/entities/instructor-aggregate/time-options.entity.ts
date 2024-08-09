import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import InstructorAvailabilityEntity from './intructor-availability.entity';

@Entity('time_option')
class TimeOptionEntity extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  index!: number;

  @Column({ type: 'time', nullable: false })
  value!: string;

  @OneToMany(
    () => InstructorAvailabilityEntity,
    (availability) => availability.startTime
  )
  startAvailability!: InstructorAvailabilityEntity[];

  @OneToMany(
    () => InstructorAvailabilityEntity,
    (availability) => availability.finalTime
  )
  finalAvailability!: InstructorAvailabilityEntity[];
}

export default TimeOptionEntity;
