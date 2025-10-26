'use client'

import { formatDate } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    created_at: string
    attachments?: string[]
    sender?: {
      id: string
      full_name: string
      avatar_url?: string
      role: string
    }
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {message.sender?.avatar_url ? (
          <img
            src={message.sender.avatar_url}
            alt={message.sender.full_name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
            {getInitials(message.sender?.full_name || 'U')}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-sm">
            {message.sender?.full_name || 'Unknown'}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {message.sender?.role}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(message.created_at)}
          </span>
        </div>
        <div className="bg-gray-100 rounded-lg p-3 inline-block max-w-2xl">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline block"
                >
                  Attachment {idx + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
