'use client'

import { ChatWindow } from '@/components/chat/ChatWindow'

export default function ChatPage({
  params,
}: {
  params: { conversationId: string }
}) {
  const { conversationId } = params

  return (
    <div className="px-4 sm:px-0 max-w-4xl mx-auto">
      <ChatWindow conversationId={conversationId} />
    </div>
  )
}
