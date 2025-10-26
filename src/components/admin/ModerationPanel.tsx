'use client'

import { trpc } from '@/utils/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function ModerationPanel() {
  const { data: stats } = trpc.admin.getStats.useQuery()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.profiles.total || 0}</div>
          <p className="text-sm text-gray-500">
            {stats?.profiles.active || 0} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.products.total || 0}</div>
          <p className="text-sm text-gray-500">
            {stats?.products.open || 0} open
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.proposals.total || 0}</div>
          <p className="text-sm text-gray-500">
            {stats?.proposals.pending || 0} pending
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats?.conversations.total || 0}
          </div>
          <p className="text-sm text-gray-500">Total active</p>
        </CardContent>
      </Card>
    </div>
  )
}
