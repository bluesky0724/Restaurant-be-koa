import { Booking } from "../../src/entity/booking";
import { Table } from "../../src/entity/table";
import { User } from "../../src/entity/user";

test("booking", () => {
  const user = new User();
  user.id = 1;
  user.name = "John Doe";
  user.email = "johndoe@gmail.com";

  const table = new Table();
  table.id = 1;
  table.table_id = 1;

  const booking = new Booking();
  booking.user = user;
  booking.table = table;
  booking.reserved_at = new Date("2023-08-01 09:00");

  expect(booking.user.id).toBe(user.id);
  expect(booking.table.id).toBe(table.id);
  expect(booking.reserved_at).toStrictEqual(new Date("2023-08-01 09:00"));

  expect(booking.user?.email).toBe("johndoe@gmail.com");
  expect(booking.user?.name).toBe("John Doe");

  expect(booking.table?.table_id).toBe(1);
});
