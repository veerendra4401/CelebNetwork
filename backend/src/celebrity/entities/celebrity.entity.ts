import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsUrl, Min, IsEnum } from 'class-validator';

export enum CelebrityCategory {
  SINGER = 'Singer',
  SPEAKER = 'Speaker',
  ACTOR = 'Actor',
}

@Entity('celebrities')
export class Celebrity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'enum',
    enum: CelebrityCategory,
  })
  @IsEnum(CelebrityCategory)
  @IsNotEmpty()
  category: CelebrityCategory;

  @Column()
  @IsString()
  @IsNotEmpty()
  country: string;

  @Column()
  @IsUrl()
  instagramUrl: string;

  @Column()
  @Min(1000)
  fanbase: number;

  @Column('text', { array: true, default: [] })
  setlist: string[];

  @Column('jsonb', { default: {} })
  socialStats: {
    instagram?: number;
    youtube?: number;
    spotify?: number;
  };

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { array: true, default: [] })
  genres: string[];

  @Column('jsonb', { default: {} })
  recentPerformances: {
    date: string;
    venue: string;
    location: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 