import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import PersonEntity from './person.entity';

@Entity({ name: 'legal_person' })
class LegalPersonEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'razon_social',
    length: 100,
    nullable: false,
  })
  razonSocial!: string;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'id' })
  person!: PersonEntity;
}

export default LegalPersonEntity;
