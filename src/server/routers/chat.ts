import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const chatRouter = router({
  createConversation: protectedProcedure
    .input(
      z.object({
        product_id: z.string().uuid(),
        proposal_id: z.string().uuid().optional(),
        influencer_id: z.string().uuid(),
        brand_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get agency profile ID
      const { data: agencyProfile } = await ctx.supabase
        .from('profiles')
        .select('id')
        .eq('role', 'agency')
        .eq('is_agency_admin', true)
        .single()

      if (!agencyProfile) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Agency profile not found',
        })
      }

      const { data, error } = await ctx.supabase
        .from('conversations')
        .insert({
          ...input,
          agency_id: agencyProfile.id,
          status: 'active',
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

  listConversations: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { data, error, count } = await ctx.supabase
        .from('conversations')
        .select(
          `
          *,
          product:products(*),
          influencer:profiles!conversations_influencer_id_fkey(*),
          brand:profiles!conversations_brand_id_fkey(*),
          agency:profiles!conversations_agency_id_fkey(*)
        `,
          { count: 'exact' }
        )
        .or(
          `influencer_id.eq.${ctx.profile.id},brand_id.eq.${ctx.profile.id},agency_id.eq.${ctx.profile.id}`
        )
        .order('updated_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      return {
        conversations: data,
        total: count || 0,
      }
    }),

  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('conversations')
        .select(
          `
          *,
          product:products(*),
          influencer:profiles!conversations_influencer_id_fkey(*),
          brand:profiles!conversations_brand_id_fkey(*),
          agency:profiles!conversations_agency_id_fkey(*)
        `
        )
        .eq('id', input.conversationId)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Conversation not found',
        })
      }

      return data
    }),

  listMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { data, error, count } = await ctx.supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(*)', {
          count: 'exact',
        })
        .eq('conversation_id', input.conversationId)
        .order('created_at', { ascending: true })
        .range(input.offset, input.offset + input.limit - 1)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      return {
        messages: data,
        total: count || 0,
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
        content: z.string().min(1),
        attachments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('messages')
        .insert({
          conversation_id: input.conversationId,
          sender_id: ctx.profile.id,
          content: input.content,
          attachments: input.attachments || [],
        })
        .select('*, sender:profiles!messages_sender_id_fkey(*)')
        .single()

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      // Update conversation updated_at
      await ctx.supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', input.conversationId)

      return data
    }),

  markAsRead: protectedProcedure
    .input(
      z.object({
        messageIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase.rpc('mark_messages_as_read', {
        message_ids: input.messageIds,
        user_id: ctx.profile.id,
      })

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      return { success: true }
    }),
})
