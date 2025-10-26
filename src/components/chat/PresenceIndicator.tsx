'use client'

interface PresenceIndicatorProps {
  activeUsers: string[]
}

export function PresenceIndicator({ activeUsers }: PresenceIndicatorProps) {
  const count = activeUsers.length

  if (count === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span>{count} active</span>
    </div>
  )
}
