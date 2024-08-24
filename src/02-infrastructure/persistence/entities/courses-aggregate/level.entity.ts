import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
@Entity('level')
class LevelEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  description!: string;
}

export default LevelEntity;
