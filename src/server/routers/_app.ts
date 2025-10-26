import { router } from '../trpc'
import { authRouter } from './auth'
import { profilesRouter } from './profiles'
import { productsRouter } from './products'
import { proposalsRouter } from './proposals'
import { chatRouter } from './chat'
import { notificationsRouter } from './notifications'
import { adminRouter } from './admin'

export const appRouter = router({
  auth: authRouter,
  profiles: profilesRouter,
  products: productsRouter,
  proposals: proposalsRouter,
  chat: chatRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
