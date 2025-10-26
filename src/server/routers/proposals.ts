import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const proposalsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        product_id: z.string().uuid(),
        message: z.string().min(10),
        proposed_rate: z.number().min(0),
        deliverables: z.array(z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.profile.role !== 'influencer') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only influencers can create proposals',
        })
      }

      const { data, error } = await ctx.supabase
        .from('proposals')
        .insert({
          influencer_id: ctx.profile.id,
          ...input,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      return data
    }),

  list: protectedProcedure
    .input(
      z.object({
        product_id: z.string().uuid().optional(),
        status: z.enum(['pending', 'accepted', 'rejected', 'withdrawn']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('proposals')
        .select('*, product:products(*), influencer:profiles!proposals_influencer_id_fkey(*)', {
          count: 'exact',
        })

      if (ctx.profile.role === 'influencer') {
        query = query.eq('influencer_id', ctx.profile.id)
      } else if (ctx.profile.role === 'brand') {
        // Get proposals for brand's products
        const { data: products } = await ctx.supabase
          .from('products')
          .select('id')
          .eq('brand_id', ctx.profile.id)

        const productIds = products?.map((p) => p.id) || []
        query = query.in('product_id', productIds)
      }

      if (input.product_id) {
        query = query.eq('product_id', input.product_id)
      }

      if (input.status) {
        query = query.eq('status', input.status)
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
        proposals: data,
        total: count || 0,
      }
    }),

  getById: protectedProcedure
    .input(z.object({ proposalId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('proposals')
        .select('*, product:products(*), influencer:profiles!proposals_influencer_id_fkey(*)')
        .eq('id', input.proposalId)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        })
      }

      return data
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        status: z.enum(['pending', 'accepted', 'rejected', 'withdrawn']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('proposals')
        .update({ status: input.status })
        .eq('id', input.proposalId)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      return data
    }),
})
