import { Hono } from "hono";
import result from "../utils/result";
import { BizError } from "../error-exc/biz-error";
import { User } from "../schema/user";
import { reqValidate } from "../middleware/req-validate";
import * as userService from "../service/user";


// mock假数据
// const users = [
//   { id: 1, name: "张三", age: 20 },
//   { id: 2, name: "李四", age: 18 },
// ];

const userRouter = new Hono<{ Bindings: Env }>().basePath("/user");

userRouter.get("/list", async (c) => {
  const users = await userService.getAll(c.env);
  return result.success(users, c)
});

userRouter.get("/", async (c) => {
   const id = Number(c.req.query("id"));
  const users = await userService.getOne(c.env, id);
  return result.success(users, c)
});

// userRouter.get("/", reqValidate("query", User), (c) => {
//   const { id } = c.req.valid("query"); // 获取经过 Zod 校验且转换(transform)后的 id
//   const user = users.find((u) => u.id === Number(id));
//   if (!user) {
//     throw new BizError("用户不存在");
//   }
//   return result.success(user, c);
// });

export default userRouter;
