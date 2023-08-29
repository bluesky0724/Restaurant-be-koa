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

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Table"])
export default class TableController {
  @request("get", "/tables")
  @summary("Find all table")
  public static async getTables(ctx: Context): Promise<void> {
    // get a table repository to perform operations with table
    const tableRepository: Repository<Table> =
      getManager().getRepository(Table);

    // load all tables
    const tables: Table[] = await tableRepository.find();

    // return OK status code and loaded tables array
    ctx.status = 200;
    ctx.body = tables;
  }

  @request("get", "/tables/{id}")
  @summary("Find table by id")
  @path({
    id: { type: "number", required: true, description: "id of table" },
  })
  public static async getTable(ctx: Context): Promise<void> {
    // get a table repository to perform operations with table
    const tableRepository: Repository<Table> =
      getManager().getRepository(Table);

    // load table by id
    const table: Table | undefined = await tableRepository.findOne(
      +ctx.params.id || 0
    );

    if (table) {
      // return OK status code and loaded table object
      ctx.status = 200;
      ctx.body = table;
    } else {
      // return a BAD REQUEST status code and error message
      ctx.status = 400;
      ctx.body = "The table you are trying to retrieve doesn't exist in the db";
    }
  }

  @request("post", "/tables")
  @summary("Create a table")
  @body(tableSchema)
  public static async createTable(ctx: Context): Promise<void> {
    // get a table repository to perform operations with table
    const tableRepository: Repository<Table> =
      getManager().getRepository(Table);

    // build up entity table to be saved
    const tableToBeSaved: Table = new Table();
    tableToBeSaved.table_id = ctx.request.body.table_id;

    // validate table entity
    const errors: ValidationError[] = await validate(tableToBeSaved); // errors is an array of validation errors

    if (errors.length > 0) {
      // return BAD REQUEST status code and errors array
      ctx.status = 400;
      ctx.body = errors;
    } else if (
      await tableRepository.findOne({ table_id: tableToBeSaved.table_id })
    ) {
      // return BAD REQUEST status code and email already exists error
      ctx.status = 400;
      ctx.body = "The specified table id already exists";
    } else {
      // save the table contained in the POST body
      const table = await tableRepository.save(tableToBeSaved);
      // return CREATED status code and updated table
      ctx.status = 201;
      ctx.body = table;
    }
  }

  @request("delete", "/tables/{id}")
  @summary("Delete table by id")
  @path({
    id: { type: "number", required: true, description: "id of user" },
  })
  public static async deleteTable(ctx: Context): Promise<void> {
    // get a table repository to perform operations with table
    const tableRepository = getManager().getRepository(Table);

    // find the table by specified id
    const tableToRemove: Table | undefined = await tableRepository.findOne(
      +ctx.params.id || 0
    );
    if (!tableToRemove) {
      // return a BAD REQUEST status code and error message
      ctx.status = 400;
      ctx.body = "The table you are trying to delete doesn't exist in the db";
    } else {
      // the table is there so can be removed
      await tableRepository.remove(tableToRemove);
      // return a NO CONTENT status code
      ctx.status = 204;
    }
  }
}
