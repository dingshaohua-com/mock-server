import User, { UserVo } from "../types/user";
import { BizError } from "../error-exc/biz-error";

// kv数据库不支持表和文档，所以以前缀来区分表行为吧
const DATA_KEY_PREFIX = "mock-server:";
const kvKey = `${DATA_KEY_PREFIX}user`;

type CreateUserInput = Omit<User, "id"> & Partial<Pick<User, "id">>;

async function getUsers(env: Env): Promise<User[]> {
  const result = (await env.MOCK_SERVER.get(kvKey)) || "[]";
  return JSON.parse(result) as User[];
}

async function setUsers(env: Env, users: User[]): Promise<void> {
  await env.MOCK_SERVER.put(kvKey, JSON.stringify(users));
}

export async function getAll(env: Env): Promise<UserVo[]> {
  const users = await getUsers(env);
  return users.map((user) => ({ id: user.id, name: user.name }));
}

export async function getOne(env: Env, id: number): Promise<User> {
  const users = await getUsers(env);
  const user = users.find((user) => user.id === id);
  if (!user) {
    throw new BizError("用户不存在");
  }
  return user;
}

export async function create(env: Env, user: CreateUserInput): Promise<User> {
  const users = await getUsers(env);
  const id = user.id ?? Math.max(0, ...users.map((item) => item.id)) + 1;

  if (users.some((item) => item.id === id)) {
    throw new BizError("用户已存在");
  }

  const newUser: User = { ...user, id };
  users.push(newUser);
  await setUsers(env, users);
  return newUser;
}

export async function update(env: Env, user: User): Promise<User> {
  const users = await getUsers(env);
  const index = users.findIndex((item) => item.id === user.id);

  if (index === -1) {
    throw new BizError("用户不存在");
  }

  users[index] = user;
  await setUsers(env, users);
  return user;
}

export async function remove(env: Env, id: number): Promise<User> {
  const users = await getUsers(env);
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new BizError("用户不存在");
  }

  const [deletedUser] = users.splice(index, 1);
  await setUsers(env, users);
  return deletedUser;
}
