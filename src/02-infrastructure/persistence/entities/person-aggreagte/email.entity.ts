import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import PersonEntity from './person.entity';

@Entity({ name: 'email' })
class EmailEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    name: 'email_address',
    nullable: false,
  })
  emailAddress!: string;

  @Column({ type: 'boolean', name: 'is_primary', default: false })
  isPrimary: boolean = false;

  @Column({ type: 'boolean', name: 'is_verified', default: false })
  isVerified: boolean = false;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'verification_token',
    nullable: true,
  })
  verificationToken!: string;

  @Column({ type: 'uuid', name: 'id_person', nullable: true })
  idPerson!: string;

  @ManyToOne(() => PersonEntity, (person) => person.emails)
  @JoinColumn({ name: 'id_person' })
  person!: PersonEntity;
}

export default EmailEntity;
