'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ProposalCardProps {
  proposal: {
    id: string
    message: string
    proposed_rate: number
    status: string
    created_at: string
    product?: {
      title: string
    }
    influencer?: {
      full_name: string
      follower_count?: number
    }
  }
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {proposal.product?.title || 'Proposal'}
          </CardTitle>
          <Badge
            variant={
              proposal.status === 'accepted'
                ? 'success'
                : proposal.status === 'rejected'
                ? 'danger'
                : 'warning'
            }
          >
            {proposal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{proposal.message}</p>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Proposed Rate: </span>
            {formatCurrency(proposal.proposed_rate)}
          </div>
          {proposal.influencer && (
            <div>
              <span className="font-medium">Influencer: </span>
              {proposal.influencer.full_name}
              {proposal.influencer.follower_count && (
                <span className="text-gray-500">
                  {' '}
                  ({proposal.influencer.follower_count.toLocaleString()}{' '}
                  followers)
                </span>
              )}
            </div>
          )}
          <div className="text-xs text-gray-500">
            {formatDate(proposal.created_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
