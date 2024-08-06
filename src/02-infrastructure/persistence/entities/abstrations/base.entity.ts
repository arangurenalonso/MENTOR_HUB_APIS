import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string = uuidv4();

  @Column({ type: 'boolean', default: true })
  active: boolean = true;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date = new Date();

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt?: Date | null;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  @BeforeUpdate()
  updateTimestamp() {
    if (this.createdAt) {
      this.createdAt = undefined;
    }

    this.updatedAt = new Date();

    if (!this.active && !this.deletedAt) {
      this.deletedAt = new Date();
    }
  }
  @BeforeInsert()
  createRimeStamp() {
    this.createdAt = new Date();
  }
}
export default BaseEntity;

// @BeforeInsert()
// checkSlugInsert() {
//   if (!this.slug) {
//     this.slug = this.title;
//   }

//   this.slug = this.slug
//     .toLowerCase()
//     .replaceAll(' ', '_')
//     .replaceAll("'", '');
// }

// @BeforeUpdate()
// checkSlugUpdate() {
//   this.slug = this.slug
//     .toLowerCase()
//     .replaceAll(' ', '_')
//     .replaceAll("'", '');
// }
