import BookingController from "../../src/controller/booking";
import { User } from "../../src/entity/user";
import { Table } from "../../src/entity/table";
import { Booking } from "../../src/entity/booking";
import { getManager } from "typeorm";
import { Context } from "koa";
import { ValidationError, validate } from "class-validator";

const user: User = new User();
user.id = 0;
user.name = "John";
user.name = "johndoe@gmail.com";

const table: Table = new Table();
table.id = 1;
table.table_id = 1;

const booking: Booking = new Booking();
booking.id = 1;
booking.user_id = 0;
booking.table_id = 1;
booking.user = user;
booking.table = table;
booking.reserved_at = new Date("2023-08-01 09:00");

jest.mock("typeorm", () => {
  const doNothing = () => {
    //Empty function that mocks typeorm annotations
  };

  return {
    getManager: jest.fn(),
    PrimaryGeneratedColumn: doNothing,
    Column: doNothing,
    Entity: doNothing,
    Equal: doNothing,
    Not: doNothing,
    Like: doNothing,
    ManyToOne: doNothing,
    JoinColumn: doNothing,
  };
});

jest.mock("class-validator", () => {
  const doNothing = () => {
    //Empty function that mocks typeorm annotations
  };

  return {
    validate: jest.fn(),
    Length: doNothing,
    IsEmail: doNothing,
    IsNumber: doNothing,
  };
});

describe("Booking controller", () => {
  it("getBooking should return status 200 and found bookings.", async () => {
    const bookingRepository = { find: jest.fn().mockReturnValue([booking]) };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => bookingRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
    } as unknown as Context;
    await BookingController.getBookings(context);
    expect(bookingRepository.find).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(200);
    expect(context.body).toStrictEqual([booking]);
  });

  it("createBooking should return status 201 if is created.", async () => {
    const bookingRepository = {
      save: jest.fn().mockReturnValue(booking),
      findOne: () => undefined as Booking,
    };
    const userRepository = {
      save: jest.fn().mockReturnValue(user),
      findOne: () => user,
    };
    const tableRepository = {
      save: jest.fn().mockReturnValue(table),
      findOne: () => table,
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: (props: any) => {
        switch (props.name) {
          case "User":
            return userRepository;
          case "Table":
            return tableRepository;
          case "Booking":
            return bookingRepository;

          default:
            return bookingRepository;
        }
      },
    });
    (validate as jest.Mock).mockReturnValue([]);
    const context = {
      status: undefined,
      body: booking,
      request: { body: booking },
    } as unknown as Context;
    await BookingController.createBooking(context);
    expect(bookingRepository.save).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(201);
    expect(context.body).toStrictEqual(booking);
  });
});
