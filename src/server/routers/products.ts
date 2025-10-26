import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const productsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        budget_min: z.number().min(0),
        budget_max: z.number().min(0),
        categories: z.array(z.string()).optional(),
        requirements: z.record(z.any()).optional(),
        attachments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.profile.role !== 'brand') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only brands can create products',
        })
      }

      const { data, error } = await ctx.supabase
        .from('products')
        .insert({
          brand_id: ctx.profile.id,
          ...input,
          status: 'draft',
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
        status: z.enum(['draft', 'open', 'in_progress', 'completed', 'cancelled']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('products')
        .select('*, brand:profiles!products_brand_id_fkey(*)', { count: 'exact' })

      // Filter based on role
      if (ctx.profile.role === 'influencer') {
        query = query.eq('status', 'open')
      } else if (ctx.profile.role === 'brand') {
        query = query.eq('brand_id', ctx.profile.id)
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
        products: data,
        total: count || 0,
      }
    }),

  getById: protectedProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('products')
        .select('*, brand:profiles!products_brand_id_fkey(*)')
        .eq('id', input.productId)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      return data
    }),

  update: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        title: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        budget_min: z.number().min(0).optional(),
        budget_max: z.number().min(0).optional(),
        categories: z.array(z.string()).optional(),
        requirements: z.record(z.any()).optional(),
        status: z.enum(['draft', 'open', 'in_progress', 'completed', 'cancelled']).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productId, ...updates } = input

      // Verify ownership
      const { data: product } = await ctx.supabase
        .from('products')
        .select('brand_id')
        .eq('id', productId)
        .single()

      if (!product || product.brand_id !== ctx.profile.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this product',
        })
      }

      const { data, error } = await ctx.supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
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

  delete: protectedProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const { data: product } = await ctx.supabase
        .from('products')
        .select('brand_id')
        .eq('id', input.productId)
        .single()

      if (!product || product.brand_id !== ctx.profile.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this product',
        })
      }

      const { error } = await ctx.supabase
        .from('products')
        .delete()
        .eq('id', input.productId)

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      return { success: true }
    }),
})
