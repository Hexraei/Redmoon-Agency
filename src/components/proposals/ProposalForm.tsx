'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ProposalFormProps {
  productId: string
}

export function ProposalForm({ productId }: ProposalFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    message: '',
    proposed_rate: 0,
  })

  const createProposal = trpc.proposals.create.useMutation({
    onSuccess: () => {
      router.push('/dashboard/proposals')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProposal.mutate({
      product_id: productId,
      ...formData,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Proposal
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Explain why you're a great fit for this collaboration..."
              required
            />
          </div>

          <Input
            label="Proposed Rate ($)"
            type="number"
            value={formData.proposed_rate}
            onChange={(e) =>
              setFormData({
                ...formData,
                proposed_rate: parseFloat(e.target.value) || 0,
              })
            }
            required
            min="0"
            step="0.01"
          />

          <Button
            type="submit"
            disabled={createProposal.isPending}
            className="w-full"
          >
            {createProposal.isPending ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
