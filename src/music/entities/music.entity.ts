import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column('float')
  duration: number;

  @Column('text')
  lyrics: string; // JSON string으로 저장
}
