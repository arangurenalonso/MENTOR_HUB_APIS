import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'boolean', default: true })
  active: boolean = true;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date = new Date();

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt?: Date | null;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
export default BaseEntity;
