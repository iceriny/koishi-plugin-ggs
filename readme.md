# @serina/koishi-plugin-ggs

[![npm](https://img.shields.io/npm/v/@serina/koishi-plugin-ggs?style=flat-square)](https://www.npmjs.com/package/@serina/koishi-plugin-ggs)

能不能好好说话? 缩写翻译工具, 感谢https://github.com/itorr/nbnhhsh

### 本服务提供了三个方法

1. **ggs(text:string)**
   - 使用 `ctx.ggs.ggs` 调用, 猜测一个缩写, 比如:

     ```typescript
     ctx.ggs.ggs("awsl");
     ```

   - 返回 **NbnhhshGuessResult**

2. **guess(text:string)**
   - 使用 `ctx.ggs.guess` 调用, 猜测多个缩写, 用逗号分割

     ```typescript
     ctx.ggs.guess("awsl,xswl");
     ```

   - 返回 **NbnhhshGuessResult**

3. **submitTranslation(name: string, text: string)**
   - 使用 `ctx.ggs.submitTranslation` 调用, 用于上传, 提供一种缩写翻译; name是缩写, text 是对应中文

     ```typescript
     ctx.ggs.submitTranslation("nh", "你好");
     ```

   - 无返回值

---

- **NbnhhshGuessResult**

```typescript
/**
 * 缩写含义查询结果
 */
interface NbnhhshGuessResult {
  /** 缩写 */
  name: string;
  /** 翻译 */
  trans?: string[] | null;
  /** 输入时可能的翻译 */
  inputting?: string[] | null;
}
```

---

### 指令

本插件提供了一个指令:

```typescript
ctx.
  .command("ggs [...abb:string]")
  .usage("将缩写转换为对应的翻译, ggs 是 good good speech 的缩写, >.<")
  .example("ggs awsl")
  .example("ggs awsl xswl")
```

指令可以通过控制台配置来关闭
