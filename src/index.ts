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
}

export const Config: Schema<Config> = Schema.object({
  useCommand: Schema.boolean()
    .default(false)
    .description("是否使用指令, 默认不使用"),
});

export function apply(ctx: Context, config: Config) {
  const ggsService = new GgsService(ctx);
  ctx.set("ggs", ggsService);

  if (config.useCommand) {
    ctx
      .command("ggs [...abb:string]")
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
  }
}
