import { ProductForm } from '@/components/products/ProductForm'

export default function NewProductPage() {
  return (
    <div className="px-4 sm:px-0 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Product</h1>
      <ProductForm />
    </div>
  )
}
