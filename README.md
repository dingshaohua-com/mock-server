```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```



## Hono 路由拆分 vs Koa 习惯

- **核心差异**：Koa 常见是一个全局 `app` + `koa-router` 挂载；Hono 更鼓励“`Hono` 实例可嵌套组合”。
- **在 Hono 里**：每个路由文件 `new Hono()` 更像“子应用/子路由”，不是重复创建主应用。
- **组合方式**：入口 `app` 挂聚合路由，聚合路由再挂各业务路由，形成树状结构。
- **优势**：模块边界清晰、中间件作用域更好控、可测试性更好、后续扩展更自然。
- **性能层面**：多创建几个 `Hono` 实例通常成本很小，工程收益远大于这点开销。
- **实践约定**：前缀管理二选一并保持一致  
  - 子路由里写 `basePath`；或  
  - 聚合层用 `route('/prefix', subRouter)` 统一挂载。  
  不建议混用。

你现在这套思路已经是偏工程化、可维护的正确方向了。后面只要统一前缀策略，就会非常稳。


## 具体业务
**1. 查询用户列表**

```bash
curl https://mock.dingshaohua.com/user/list
```

返回示例：

```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "name": "张三"
    }
  ],
  "msg": "ok"
}
```

**2. 查询单个用户**

```bash
curl "https://mock.dingshaohua.com/user?id=1"
```

**3. 新增用户**

不传 `id`，后端会自动生成：

```bash
curl -X POST https://mock.dingshaohua.com/user \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","age":20,"gender":0,"love":["玩游戏","运动"]}'
```

也可以手动传 `id`：

```bash
curl -X POST https://mock.dingshaohua.com/user \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"张三","age":20,"gender":0,"love":["玩游戏","运动"]}'
```

**4. 更新用户**

更新时必须传完整用户对象，包括 `id`：

```bash
curl -X PUT https://mock.dingshaohua.com/user \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"李四","age":22,"gender":0,"love":["运动","看书"]}'
```

**5. 删除用户**

```bash
curl -X DELETE "https://mock.dingshaohua.com/user?id=1"
```