import { Context, Service } from "koishi";

const NBNHHSH_BASE_URL = "https://lab.magiconch.com/api/nbnhhsh";

/**
 * 缩写含义查询结果
 */
export interface NbnhhshGuessResult {
  /** 缩写 */
  name: string;
  /** 翻译 */
  trans?: string[] | null;
  /** 输入时可能的翻译 */
  inputting?: string[] | null;
}

export class GgsService extends Service {
  constructor(ctx: Context) {
    super(ctx, "ggs");
  }

  /**
   * 批量查询缩写含义。
   * `text` 可以是单个缩写，也可以是逗号分隔的多个缩写。
   */
  async guess(text: string): Promise<NbnhhshGuessResult[]> {
    return this.ctx.http.post<NbnhhshGuessResult[]>(
      `${NBNHHSH_BASE_URL}/guess`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  /**
   * 获取缩写对应的含义
   * ggs 是 good good speech 的缩写, >.<
   * @param abb 缩写
   */
  async ggs(abb: string): Promise<NbnhhshGuessResult[]> {
    return this.guess(abb);
  }

  /**
   * 提交新的缩写释义。
   * `name` 为缩写，`text` 为要提交的中文释义。
   */
  async submitTranslation(name: string, text: string): Promise<void> {
    await this.ctx.http.post(
      `${NBNHHSH_BASE_URL}/translation/${encodeURIComponent(name)}`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
