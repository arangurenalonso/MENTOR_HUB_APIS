import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import NaturalPersonEntity from '../person-aggreagte/natural_person.entity';
import BaseEntity from '../abstrations/base.entity';

@Entity({ name: 'instructor' })
class InstructorEntity extends BaseEntity {
  @OneToOne(() => NaturalPersonEntity)
  @JoinColumn({ name: 'id' })
  naturalPerson!: NaturalPersonEntity;
}

export default InstructorEntity;
