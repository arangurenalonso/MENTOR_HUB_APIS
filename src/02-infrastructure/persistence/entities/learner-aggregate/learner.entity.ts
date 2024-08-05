import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import NaturalPersonEntity from '../person-aggreagte/natural_person.entity';

@Entity({ name: 'learner' })
class LearnerEntity extends BaseEntity {
  @OneToOne(() => NaturalPersonEntity)
  @JoinColumn({ name: 'id' })
  naturalPerson!: NaturalPersonEntity;
}

export default LearnerEntity;
