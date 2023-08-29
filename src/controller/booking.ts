import { Context } from "koa";
import {
  body,
  path,
  request,
  responsesAll,
  summary,
  tagsAll,
} from "koa-swagger-decorator";
import { Table, tableSchema } from "../entity/table";
import { Repository, getManager } from "typeorm";
import { ValidationError, validate } from "class-validator";
import { Booking, bookingSchema } from "../entity/booking";
import { User } from "../entity/user";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Booking"])
export default class BookingController {
  @request("get", "/bookings")
  @summary("Find all bookings")
  public static async getBookings(ctx: Context): Promise<void> {
    // get a booking repository to perform operations with booking
    const bookingRepository: Repository<Booking> =
      getManager().getRepository(Booking);

    // load all bookings
    const bookings: Booking[] = await bookingRepository.find({
      relations: ["user", "table"],
    });

    // return OK status code and loaded bookings array
    ctx.status = 200;
    ctx.body = bookings;
  }

  @request("post", "/bookings")
  @summary("Create a booking")
  @body(bookingSchema)
  public static async createBooking(ctx: Context): Promise<void> {
    // get a booking repository to perform operations with booking
    const bookingRepository: Repository<Booking> =
      getManager().getRepository(Booking);
    const userRepository: Repository<User> = getManager().getRepository(User);
    const tableRepository: Repository<Table> =
      getManager().getRepository(Table);

    // build up entity booking to be saved
    const bookingToBeSaved: Booking = new Booking();
    bookingToBeSaved.user_id = ctx.request.body.user_id;
    bookingToBeSaved.table_id = ctx.request.body.table_id;
    bookingToBeSaved.reserved_at = ctx.request.body.reserved_at;

    // validate booking entity
    const errors: ValidationError[] = await validate(bookingToBeSaved); // errors is an array of validation errors

    if (!(await userRepository.findOne({ id: bookingToBeSaved.user_id }))) {
      ctx.status = 400;
      ctx.body = "User not exist";
      return;
    }

    if (!(await tableRepository.findOne({ id: bookingToBeSaved.table_id }))) {
      ctx.status = 400;
      ctx.body = "Table not exist";
      return;
    }

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400;
      ctx.body = errors;
    } else if (
      await bookingRepository.findOne({
        table_id: bookingToBeSaved.table_id,
        reserved_at: bookingToBeSaved.reserved_at,
      })
    ) {
      // return BAD REQUEST status code and email already exists error
      ctx.status = 400;
      ctx.body = "The timeslot is filled. Select other slot";
    } else {
      // save the booking contained in the POST body
      const booking = await bookingRepository.save(bookingToBeSaved);
      // return CREATED status code and updated booking
      ctx.status = 201;
      ctx.body = booking;
    }
  }
}
