'use client'

import { trpc } from '@/utils/trpc'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function ProductList() {
  const { data, isLoading } = trpc.products.list.useQuery({
    limit: 20,
    offset: 0,
  })

  if (isLoading) {
    return <div>Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link href="/dashboard/products/new">
          <Button>Create Product</Button>
        </Link>
      </div>
      {data?.products && data.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No products found. Create your first product!
        </div>
      )}
    </div>
  )
}
