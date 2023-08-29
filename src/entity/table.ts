import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber } from "class-validator";

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  table_id: number;

  @Column({ default: 100 })
  @IsNumber()
  limit: number;
}

export const tableSchema = {
  id: { type: "number", required: true, example: 1 },
  table_id: { type: "number", required: true, example: 1 },
};
