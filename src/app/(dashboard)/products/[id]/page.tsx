'use client'

import { use } from 'react'
import { trpc } from '@/utils/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { ProposalForm } from '@/components/proposals/ProposalForm'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: product, isLoading } = trpc.products.getById.useQuery({
    productId: id,
  })
  const { data: profile } = trpc.profiles.getMyProfile.useQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="px-4 sm:px-0 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>{product.title}</CardTitle>
            <Badge
              variant={
                product.status === 'open'
                  ? 'success'
                  : product.status === 'draft'
                  ? 'warning'
                  : 'default'
              }
            >
              {product.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Budget</h3>
            <p>
              {formatCurrency(product.budget_min)} -{' '}
              {formatCurrency(product.budget_max)}
            </p>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="flex gap-2 flex-wrap">
                {product.categories.map((cat: string) => (
                  <Badge key={cat}>{cat}</Badge>
                ))}
              </div>
            </div>
          )}

          {product.brand && (
            <div>
              <h3 className="font-medium mb-2">Brand</h3>
              <p>{product.brand.company_name || product.brand.full_name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {profile?.role === 'influencer' && product.status === 'open' && (
        <div className="mt-6">
          <ProposalForm productId={id} />
        </div>
      )}
    </div>
  )
}
