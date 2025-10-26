import { router, protectedProcedure, agencyProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const profilesRouter = router({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', ctx.user.id)
      .single()

    if (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Profile not found',
      })
    }

    return data
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        full_name: z.string().min(2).optional(),
        bio: z.string().optional(),
        avatar_url: z.string().url().optional().nullable(),
        social_handles: z.record(z.string()).optional(),
        follower_count: z.number().int().min(0).optional(),
        engagement_rate: z.number().min(0).max(100).optional(),
        categories: z.array(z.string()).optional(),
        company_name: z.string().optional(),
        industry: z.string().optional(),
        website: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('profiles')
        .update(input)
        .eq('user_id', ctx.user.id)
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

  getProfileById: protectedProcedure
    .input(z.object({ profileId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('profiles')
        .select('*')
        .eq('id', input.profileId)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        })
      }

      return data
    }),

  listProfiles: agencyProcedure
    .input(
      z.object({
        role: z.enum(['influencer', 'brand', 'agency']).optional(),
        status: z.enum(['pending', 'active', 'suspended']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase.from('profiles').select('*', { count: 'exact' })

      if (input.role) {
        query = query.eq('role', input.role)
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
        profiles: data,
        total: count || 0,
      }
    }),

  updateProfileStatus: agencyProcedure
    .input(
      z.object({
        profileId: z.string().uuid(),
        status: z.enum(['pending', 'active', 'suspended']),
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

      return data
    }),
})
