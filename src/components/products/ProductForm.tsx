'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function ProductForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_min: 0,
    budget_max: 0,
    categories: [] as string[],
  })

  const createProduct = trpc.products.create.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/products/${data.id}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProduct.mutate(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="E.g., Instagram Campaign for Fashion Brand"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Describe the collaboration opportunity..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Budget ($)"
              type="number"
              value={formData.budget_min}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget_min: parseFloat(e.target.value) || 0,
                })
              }
              required
              min="0"
              step="0.01"
            />

            <Input
              label="Maximum Budget ($)"
              type="number"
              value={formData.budget_max}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget_max: parseFloat(e.target.value) || 0,
                })
              }
              required
              min="0"
              step="0.01"
            />
          </div>

          <Button
            type="submit"
            disabled={createProduct.isPending}
            className="w-full"
          >
            {createProduct.isPending ? 'Creating...' : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
