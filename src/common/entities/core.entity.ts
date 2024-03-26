import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CoreEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => Date)
  @Column()
  createdAt: Date;

  @Field((type) => Date)
  @Column()
  updatedAt: Date;
}
