
import { Hono } from 'hono'
import result from '../utils/result'

const rootRouter = new Hono<{ Bindings: Env }>()

rootRouter.get('/', (c) => result.success({ name: 'Dingshaohua' }, c))

export default rootRouter
