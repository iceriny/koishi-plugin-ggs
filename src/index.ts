import "koishi";
import { Context, Schema } from "koishi";
import { GgsService } from "./service";

declare module "koishi" {
  interface Context {
    ggs: GgsService;
  }
}

export const name = "ggs";

export const inject = {
  required: ["http"],
};

export interface Config {
  /** 是否使用指令 */
  useCommand: boolean;
  /** what2eat 接口 Token */
  what2eatToken?: string;
}

export const Config: Schema<Config> = Schema.object({
  useCommand: Schema.boolean()
    .default(false)
    .description("是否使用指令, 默认不使用"),
  what2eatToken: Schema.string()
    .description("what2eat 接口 Token, 用于调用今天吃什么 API"),
});

export function apply(ctx: Context, config: Config) {
  const ggsService = new GgsService(ctx);
  ctx.set("ggs", ggsService);

  if (config.useCommand) {
    ctx
      .command("ggs [...abb:string]", "查询缩写含义")
      .usage("将缩写转换为对应的翻译, ggs 是 good good speech 的缩写, >.<")
      .example("ggs awsl")
      .example("ggs awsl xswl")
      .action(async ({ session }, ...args) => {
        if (args.length === 0) {
          return session.send("请输入缩写");
        }
        const result = (await ggsService.guess(args.join(",")))
          .map((item) => {
            return `${item.name} => ${item.trans?.join(",") ?? "无翻译"}\n`;
          })
          .join("===============\n");
        return result;
      });

    ctx.command("what2eat", "随机推荐今天吃什么").action(async () => {
      if (!config.what2eatToken) {
        return "请先在 ggs 插件配置中填写 what2eatToken";
      }

      try {
        const result = await ggsService.what2eat(config.what2eatToken);
        const food = result.data?.food?.trim();

        if (result.code !== 200) {
          return result.message || "获取今日推荐失败";
        }

        if (!food) {
          return "接口返回成功, 但没有获取到推荐食物";
        }

        return `我要吃.... ${food} !`;


      } catch (error) {
        ctx.logger("ggs").warn(error);
        return "获取今日推荐失败, 请稍后重试";
      }
    });
  }
}
