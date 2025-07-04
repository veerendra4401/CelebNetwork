import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Fan } from './fan.entity';

export enum NotificationType {
  PERFORMANCE = 'performance',
  UPDATE = 'update',
  ANNOUNCEMENT = 'announcement',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Fan, fan => fan.notifications)
  fan: Fan;
} 