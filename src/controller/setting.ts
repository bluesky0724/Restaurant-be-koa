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
import { Setting, settingSchema } from "../entity/setting";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Setting"])
export default class SettingController {
  public static async getOrCreateSetting() {}

  @request("get", "/setting")
  @summary("Find Setting")
  public static async getSetting(ctx: Context): Promise<void> {
    const settingRepository: Repository<Setting> =
      getManager().getRepository(Setting);

    let setting: Setting = await settingRepository.findOne({});
    if (!setting) {
      setting = await settingRepository.save({});
    }
    ctx.status = 200;
    ctx.body = setting;
  }

  @request("post", "/setting")
  @summary("Update Setting")
  @body(settingSchema)
  public static async getTables(ctx: Context): Promise<void> {
    if (ctx.request.body.open > 24 || ctx.request.body.close > 24) {
      ctx.status = 400;
      ctx.body = "Open and close time should be less than 24";
      return;
    }
    if (ctx.request.body.open > ctx.request.body.close) {
      ctx.status = 400;
      ctx.body = "Open time is earlier than close time";
      return;
    }
    // get a table repository to perform operations with table
    const settingRepository: Repository<Setting> =
      getManager().getRepository(Setting);

    let setting: Setting = await settingRepository.findOne({});
    if (!setting) {
      setting = await settingRepository.save({});
    }
    setting.open = ctx.request.body.open;
    setting.close = ctx.request.body.close;

    await settingRepository.save(setting);

    ctx.status = 200;
    ctx.body = setting;
    return;
  }
}
