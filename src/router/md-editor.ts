import { Hono } from "hono";
import result from "../utils/result";
import * as mdService from "../service/md-editor";

const mdEditorRouter = new Hono<{ Bindings: Env }>().basePath("/md-editor");

mdEditorRouter.get("/md-content", async (c) => {
  const res = await mdService.getMdContent(c.env);
  return result.success(res, c);
});

mdEditorRouter.post("/md-content", async (c) => {
  const { content } = await c.req.json<{ content: string }>();
  const res = await mdService.setMdContent(c.env, content);
  return result.success(res, c);
});

export default mdEditorRouter;
