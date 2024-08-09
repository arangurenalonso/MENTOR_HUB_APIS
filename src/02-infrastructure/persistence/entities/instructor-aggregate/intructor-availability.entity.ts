import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import DayOfWeekEntity from './day-of-week.entity';
import InstructorEntity from './instructor.entity';
import TimeOptionEntity from './time-options.entity';
import BaseEntity from '../abstrations/base.entity';

@Entity('instructor_availability')
class InstructorAvailabilityEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  idInstructor!: string;

  @Column({ type: 'uuid', nullable: false })
  idDayOfWeek!: string;

  @Column({ type: 'uuid', nullable: false })
  idStartTime!: string;

  @Column({ type: 'uuid', nullable: false })
  idFinalTime!: string;

  @ManyToOne(() => InstructorEntity, (instructor) => instructor.availability)
  @JoinColumn({
    name: 'idInstructor',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_InstructorAvailability_Instructor',
  })
  instructor!: InstructorEntity;

  @ManyToOne(() => DayOfWeekEntity, (dayOfWeek) => dayOfWeek.availability)
  @JoinColumn({
    name: 'idDayOfWeek',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_InstructorAvailability_DayOfWeek',
  })
  dayOfWeek!: DayOfWeekEntity;

  @ManyToOne(() => TimeOptionEntity, (startTime) => startTime.startAvailability)
  @JoinColumn({
    name: 'idStartTime',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_InstructorAvailability_StartTime',
  })
  startTime!: TimeOptionEntity;

  @ManyToOne(() => TimeOptionEntity, (finalTime) => finalTime.finalAvailability)
  @JoinColumn({
    name: 'idFinalTime',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_InstructorAvailability_FinalTime',
  })
  finalTime!: TimeOptionEntity;
}

export default InstructorAvailabilityEntity;
