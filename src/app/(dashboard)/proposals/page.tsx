'use client'

import { trpc } from '@/utils/trpc'
import { ProposalCard } from '@/components/proposals/ProposalCard'

export default function ProposalsPage() {
  const { data, isLoading } = trpc.proposals.list.useQuery({
    limit: 20,
    offset: 0,
  })

  if (isLoading) {
    return <div>Loading proposals...</div>
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Proposals</h1>
      {data?.proposals && data.proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No proposals yet. Browse products to submit your first proposal!
        </div>
      )}
    </div>
  )
}
