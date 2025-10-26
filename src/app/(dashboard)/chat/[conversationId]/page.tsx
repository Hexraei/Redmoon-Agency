'use client'

import { use } from 'react'
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = use(params)

  return (
    <div className="px-4 sm:px-0 max-w-4xl mx-auto">
      <ChatWindow conversationId={conversationId} />
    </div>
  )
}
