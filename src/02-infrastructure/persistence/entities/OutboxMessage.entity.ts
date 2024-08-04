import { Entity, Column } from 'typeorm';
import BaseEntity from './abstrations/base.entity';

@Entity('outbox_messages')
class OutboxMessageEntity extends BaseEntity {
  @Column({
    type: 'timestamp',
    name: 'occurred_on_utc',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurredOnUtc!: Date;

  @Column()
  type!: string;

  @Column()
  content!: string;

  @Column({ type: 'bool', default: false })
  isProcessed!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  processedOnUtc?: Date;

  @Column({ nullable: true })
  error?: string;
}

export default OutboxMessageEntity;
