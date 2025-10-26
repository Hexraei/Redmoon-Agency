import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure

// Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
      profile: ctx.profile!,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)

// Agency-only middleware
const isAgency = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.profile || ctx.profile.role !== 'agency') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({
    ctx: {
      user: ctx.user,
      profile: ctx.profile,
    },
  })
})

export const agencyProcedure = t.procedure.use(isAuthed).use(isAgency)
