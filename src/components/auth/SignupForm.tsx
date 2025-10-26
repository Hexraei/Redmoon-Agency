'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'influencer' as 'influencer' | 'brand' | 'agency',
  })
  const [error, setError] = useState('')

  const signUp = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      router.push('/dashboard')
      router.refresh()
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    signUp.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-gray-600">Join REDMOON Agency</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({ ...formData, fullName: e.target.value })
        }
        placeholder="John Doe"
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="you@example.com"
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        placeholder="••••••••"
        required
        minLength={8}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          I am a...
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as 'influencer' | 'brand' | 'agency',
            })
          }
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          required
        >
          <option value="influencer">Influencer</option>
          <option value="brand">Brand</option>
          <option value="agency">Agency</option>
        </select>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={signUp.isPending}
      >
        {signUp.isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-black hover:underline font-medium">
          Sign in
        </a>
      </p>
    </form>
  )
}
