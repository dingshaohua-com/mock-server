// kv数据库不支持表和文档，所以以前缀来区分表行为吧
const MD_EDITOR_KEY_PREFIX = "md-editor:";
const kvKey = `${MD_EDITOR_KEY_PREFIX}md_content`;

export async function getMdContent(env: Env): Promise<string> {
  return (await env.MOCK_SERVER.get(kvKey)) ?? "";
}

export async function setMdContent(env: Env, value: string): Promise<string> {
  await env.MOCK_SERVER.put(kvKey, value);
  return value;
}
