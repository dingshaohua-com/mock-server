import { Context, Hono } from "hono";
import result from "../utils/result";
import { BizError } from "../error-exc/biz-error";
import * as userService from "../service/user";
import User from "../types/user";


// mock假数据
// const users = [
//   { id: 1, name: "张三", age: 20 },
//   { id: 2, name: "李四", age: 18 },
// ];

const userRouter = new Hono<{ Bindings: Env }>().basePath("/user");

function getIdFromQuery(c: Context<{ Bindings: Env }>): number {
  const id = Number(c.req.query("id"));
  if (!Number.isInteger(id) || id <= 0) {
    throw new BizError("用户id不合法");
  }
  return id;
}

userRouter.get("/list", async (c) => {
  const users = await userService.getAll(c.env);
  return result.success(users, c);
});

userRouter.get("/", async (c) => {
  const id = getIdFromQuery(c);
  const user = await userService.getOne(c.env, id);
  return result.success(user, c);
});

userRouter.post("/", async (c) => {
  const user = await c.req.json<Omit<User, "id"> & Partial<Pick<User, "id">>>();
  const newUser = await userService.create(c.env, user);
  return result.success(newUser, c);
});

userRouter.put("/", async (c) => {
  const user = await c.req.json<User>();
  const updatedUser = await userService.update(c.env, user);
  return result.success(updatedUser, c);
});

userRouter.delete("/", async (c) => {
  const id = getIdFromQuery(c);
  const deletedUser = await userService.remove(c.env, id);
  return result.success(deletedUser, c);
});

export default userRouter;
