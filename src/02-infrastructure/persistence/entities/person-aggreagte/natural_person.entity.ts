import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import PersonEntity from './person.entity';

@Entity({ name: 'natural_person' })
class NaturalPersonEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'date', nullable: true })
  birthdate?: Date | null;

  // @Column({ type: 'varchar', nullable: true })
  // photoUrl?: string;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'id' })
  person!: PersonEntity;
}

export default NaturalPersonEntity;
