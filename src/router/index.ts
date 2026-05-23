import { Hono } from 'hono'
import userRouter from './user'
import rootRouter from './root'
import mdEditorRouter from './md-editor'

const app = new Hono<{ Bindings: Env }>()

// 使用 .route() 方法实现模块化挂载，相当于 Koa 的 wrappRouter.use()
const routerModules = [userRouter, rootRouter, mdEditorRouter]
routerModules.forEach(router => {
  app.route('/', router)
})

export default app
