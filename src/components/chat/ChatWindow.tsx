'use client'

import { useEffect, useState, useRef } from 'react'
import { trpc } from '@/utils/trpc'
import { createClient } from '@/lib/supabase/client'
import { MessageBubble } from './MessageBubble'
import { PresenceIndicator } from './PresenceIndicator'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ChatWindowProps {
  conversationId: string
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const { data: conversation } = trpc.chat.getConversation.useQuery({
    conversationId,
  })

  const { data: messagesData, refetch } = trpc.chat.listMessages.useQuery({
    conversationId,
    limit: 50,
  })

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setNewMessage('')
      refetch()
    },
  })

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          refetch()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, refetch, supabase])

  // Handle presence
  useEffect(() => {
    const joinPresence = async () => {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, action: 'join' }),
      })
    }

    const leavePresence = async () => {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, action: 'leave' }),
      })
    }

    joinPresence()

    // Poll for active users
    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/presence?conversationId=${conversationId}`
      )
      const data = await res.json()
      setActiveUsers(data.activeUsers || [])
    }, 5000)

    return () => {
      clearInterval(interval)
      leavePresence()
    }
  }, [conversationId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesData?.messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage.mutate({
        conversationId,
        content: newMessage,
      })
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>
            {conversation?.product.title || 'Conversation'}
          </CardTitle>
          <PresenceIndicator activeUsers={activeUsers} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesData?.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={sendMessage.isPending || !newMessage.trim()}>
            Send
          </Button>
        </form>
      </div>
    </Card>
  )
}
