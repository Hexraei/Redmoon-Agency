import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const notificationsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        read: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', ctx.user.id)

      if (input.read !== undefined) {
        query = query.eq('read', input.read)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      return {
        notifications: data,
        total: count || 0,
      }
    }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationIds: z.array(z.string().uuid()) }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from('notifications')
        .update({ read: true })
        .in('id', input.notificationIds)
        .eq('user_id', ctx.user.id)

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      return { success: true }
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const { error } = await ctx.supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', ctx.user.id)
      .eq('read', false)

    if (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message,
      })
    }

    return { success: true }
  }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const { count, error } = await ctx.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', ctx.user.id)
      .eq('read', false)

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })
    }

    return { count: count || 0 }
  }),
})
