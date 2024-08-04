import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import NaturalPersonEntity from './person-aggreagte/natural_person.entity';

@Entity({ name: 'learner' })
class LearnerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @OneToOne(() => NaturalPersonEntity)
  @JoinColumn({ name: 'id' })
  naturalPerson!: NaturalPersonEntity;
}

export default LearnerEntity;
