'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface ProductCardProps {
  product: {
    id: string
    title: string
    description: string
    budget_min: number
    budget_max: number
    categories: string[]
    status: string
    brand?: {
      full_name: string
      company_name?: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/dashboard/products/${product.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{product.title}</CardTitle>
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
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Budget: </span>
              {formatCurrency(product.budget_min)} -{' '}
              {formatCurrency(product.budget_max)}
            </div>
            {product.categories.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {product.categories.slice(0, 3).map((cat) => (
                  <Badge key={cat} variant="default">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
            {product.brand && (
              <div className="text-xs text-gray-500">
                By {product.brand.company_name || product.brand.full_name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
