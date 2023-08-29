import UserController from "../../src/controller/user";
import TableController from "../../src/controller/table";
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

describe("Table controller", () => {
  it("getTables should return status 200 and found tables.", async () => {
    const tableRepository = { find: jest.fn().mockReturnValue([table]) };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
    } as unknown as Context;
    await TableController.getTables(context);
    expect(tableRepository.find).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(200);
    expect(context.body).toStrictEqual([table]);
  });

  it("getTable should return status 200 and single user found by id.", async () => {
    const tableRepository = { findOne: jest.fn().mockReturnValue(table) };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
      params: { id: 1 },
    } as unknown as Context;
    await TableController.getTable(context);
    expect(tableRepository.findOne).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(200);
    expect(context.body).toStrictEqual(table);
  });

  it("getTable should return status 400 and no user found by id.", async () => {
    const tableRepository = { findOne: jest.fn().mockReturnValue(undefined) };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
      params: { id: 2 },
    } as unknown as Context;
    await TableController.getTable(context);
    expect(tableRepository.findOne).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(400);
    expect(context.body).toBe(
      "The table you are trying to retrieve doesn't exist in the db"
    );
  });

  it("createTable should return status 201 if is created.", async () => {
    const tableRepository = {
      save: jest.fn().mockReturnValue(table),
      findOne: () => undefined as Table,
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    (validate as jest.Mock).mockReturnValue([]);
    const context = {
      status: undefined,
      body: undefined,
      request: { body: table },
    } as unknown as Context;
    await TableController.createTable(context);
    expect(tableRepository.save).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(201);
    expect(context.body).toStrictEqual(table);
  });

  it("createTable should return status 400 if it is already created.", async () => {
    const tableRepository = {
      save: jest.fn().mockReturnValue(table),
      findOne: () => table,
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    (validate as jest.Mock).mockReturnValue([]);
    const context = {
      status: undefined,
      body: undefined,
      request: { body: table },
    } as unknown as Context;
    await TableController.createTable(context);
    expect(tableRepository.save).toHaveBeenCalledTimes(0);
    expect(context.status).toBe(400);
    expect(context.body).toBe("The specified table id already exists");
  });

  it("createUser should return status 400 if there are validation errors.", async () => {
    const tableRepository = {
      save: jest.fn().mockReturnValue(table),
      findOne: () => undefined as Table,
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    (validate as jest.Mock).mockReturnValue(["table_id should be number"]);
    const context = {
      status: undefined,
      body: undefined,
      request: { body: table },
    } as unknown as Context;
    await TableController.createTable(context);
    expect(tableRepository.save).toHaveBeenCalledTimes(0);
    expect(context.status).toBe(400);
    expect(context.body).toStrictEqual(["table_id should be number"]);
  });

  it("deleteUser should return status 400 if table does not exists.", async () => {
    const tableRepository = {
      remove: jest.fn().mockReturnValue(undefined),
      findOne: () => undefined as Table,
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
      params: { id: 0 },
      state: { table: table },
    } as unknown as Context;
    await TableController.deleteTable(context);
    expect(tableRepository.remove).toHaveBeenCalledTimes(0);
    expect(context.status).toBe(400);
    expect(context.body).toStrictEqual(
      "The table you are trying to delete doesn't exist in the db"
    );
  });

  it("deleteUser should return status 204 if table exists.", async () => {
    const tableRepository = {
      remove: jest.fn().mockReturnValue(undefined),
      findOne: () => table,
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => tableRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
      params: { id: 0 },
      state: { table: table },
    } as unknown as Context;
    await TableController.deleteTable(context);
    expect(tableRepository.remove).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(204);
  });
});
