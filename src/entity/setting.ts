import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsNumber } from "class-validator";

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 9 })
  @IsNumber()
  open: number;

  @Column({ default: 18 })
  @IsNumber()
  close: number;
}

export const settingSchema = {
  open: { type: "number", required: true, example: 9 },
  close: { type: "number", required: true, example: 18 },
};
