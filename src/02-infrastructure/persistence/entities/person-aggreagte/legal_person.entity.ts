import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import PersonEntity from './person.entity';

@Entity({ name: 'legal_person' })
class LegalPersonEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'id' })
  person!: PersonEntity;
}

export default LegalPersonEntity;
