import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { Celebrity } from '../../celebrity/entities/celebrity.entity';
import { Notification } from './notification.entity';

@Entity('fans')
export class Fan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @ManyToMany(() => Celebrity)
  @JoinTable({
    name: 'fan_follows_celebrity',
    joinColumn: {
      name: 'fan_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'celebrity_id',
      referencedColumnName: 'id',
    },
  })
  followedCelebrities: Celebrity[];

  @OneToMany(() => Notification, notification => notification.fan)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 