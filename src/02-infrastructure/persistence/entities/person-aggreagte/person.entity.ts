import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import NaturalPersonEntity from './natural_person.entity';
import LegalPersonEntity from './legal_person.entity';
import UserEntity from '../user-aggregate/user.entity';
import EmailEntity from './email.entity';
import BaseEntity from '../abstrations/base.entity';
import PersonTypeEnum from '@domain/persona-aggregate/root/enum/person-type.enum';

@Entity({ name: 'person' })
class PersonEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: PersonTypeEnum,
    default: PersonTypeEnum.NATURAL,
  })
  personType?: PersonTypeEnum;

  // @Column({ type: 'varchar', nullable: true })
  // photoUrl?: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id' })
  user!: UserEntity;

  @OneToOne(() => NaturalPersonEntity, (naturalPerson) => naturalPerson.person)
  naturalPerson?: NaturalPersonEntity;

  @OneToOne(() => LegalPersonEntity, (legalPerson) => legalPerson.person)
  legalPerson?: NaturalPersonEntity;

  @OneToMany(() => EmailEntity, (email) => email.person)
  emails!: EmailEntity[];
}

export default PersonEntity;
