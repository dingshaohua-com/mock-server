import User from "../types/user";
import { BizError } from "../error-exc/biz-error";

// kv数据库不支持表和文档，所以以前缀来区分表行为吧
const DATA_KEY_PREFIX = "mock-server:";
const kvKey = `${DATA_KEY_PREFIX}user`;

export async function getAll(env: Env): Promise<User[]> {
  let result = (await env.MOCK_SERVER.get(kvKey)) || "[]";
  result = JSON.parse(result) as User[]
  const newRes = result.map((it: User)=>({id: it.id, name: it.name}))
  return newRes;
}

export async function getOne(env: Env, id: number): Promise<User> {
  const users = await getAll(env);
  const user = users.find((user) => user.id === id);
  if (!user) {
    throw new BizError("用户不存在");
  }
  return user;
}


// export async function setUsers(env: Env, value: string): Promise<string> {
//   await env.MOCK_SERVER.put(kvKey, value);
//   return value;
// }
