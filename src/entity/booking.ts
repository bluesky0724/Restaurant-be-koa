import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import { User } from "./user";
import { Table } from "./table";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user?: User;

  @Column()
  table_id: number;

  @ManyToOne(() => Table)
  @JoinColumn({ name: "table_id" })
  table?: Table;

  @Column()
  reserved_at: Date;
}

export const bookingSchema = {
  user_id: { type: "number", required: true, example: 1 },
  table_id: { type: "number", required: true, example: 2 },
  reserved_at: { type: "date", required: true, example: "2023-08-01" },
};
