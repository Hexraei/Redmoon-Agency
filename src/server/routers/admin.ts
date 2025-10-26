import { router, agencyProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const adminRouter = router({
  getStats: agencyProcedure.query(async ({ ctx }) => {
    // Get profile counts
    const { count: totalProfiles } = await ctx.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: activeProfiles } = await ctx.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: totalProducts } = await ctx.supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    const { count: openProducts } = await ctx.supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open')

    const { count: totalProposals } = await ctx.supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })

    const { count: pendingProposals } = await ctx.supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: totalConversations } = await ctx.supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })

    return {
      profiles: {
        total: totalProfiles || 0,
        active: activeProfiles || 0,
      },
      products: {
        total: totalProducts || 0,
        open: openProducts || 0,
      },
      proposals: {
        total: totalProposals || 0,
        pending: pendingProposals || 0,
      },
      conversations: {
        total: totalConversations || 0,
      },
    }
  }),

  listAuditLogs: agencyProcedure
    .input(
      z.object({
        action: z.string().optional(),
        resource_type: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })

      if (input.action) {
        query = query.eq('action', input.action)
      }

      if (input.resource_type) {
        query = query.eq('resource_type', input.resource_type)
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
        logs: data,
        total: count || 0,
      }
    }),

  moderateProfile: agencyProcedure
    .input(
      z.object({
        profileId: z.string().uuid(),
        status: z.enum(['pending', 'active', 'suspended']),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('profiles')
        .update({ status: input.status })
        .eq('id', input.profileId)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      // Create audit log
      await ctx.supabase.rpc('create_audit_log', {
        p_user_id: ctx.user.id,
        p_action: 'profile_status_changed',
        p_resource_type: 'profile',
        p_resource_id: input.profileId,
        p_changes: {
          status: input.status,
          reason: input.reason,
        },
      })

      return data
    }),

  moderateProduct: agencyProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        status: z.enum(['draft', 'open', 'in_progress', 'completed', 'cancelled']),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('products')
        .update({ status: input.status })
        .eq('id', input.productId)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      // Create audit log
      await ctx.supabase.rpc('create_audit_log', {
        p_user_id: ctx.user.id,
        p_action: 'product_updated',
        p_resource_type: 'product',
        p_resource_id: input.productId,
        p_changes: {
          status: input.status,
          reason: input.reason,
        },
      })

      return data
    }),
})
