'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/utils/trpc'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function ProfileEditor() {
  const { data: profile, isLoading } = trpc.profiles.getMyProfile.useQuery()
  const utils = trpc.useContext()

  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    social_handles: {} as Record<string, string>,
    follower_count: 0,
    engagement_rate: 0,
    categories: [] as string[],
    company_name: '',
    industry: '',
    website: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        social_handles: (profile.social_handles as Record<string, string>) || {},
        follower_count: profile.follower_count || 0,
        engagement_rate: profile.engagement_rate || 0,
        categories: profile.categories || [],
        company_name: profile.company_name || '',
        industry: profile.industry || '',
        website: profile.website || '',
      })
    }
  }, [profile])

  const updateProfile = trpc.profiles.updateProfile.useMutation({
    onSuccess: () => {
      utils.profiles.getMyProfile.invalidate()
      alert('Profile updated successfully!')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(formData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Tell us about yourself..."
            />
          </div>

          <Input
            label="Avatar URL"
            type="url"
            value={formData.avatar_url}
            onChange={(e) =>
              setFormData({ ...formData, avatar_url: e.target.value })
            }
            placeholder="https://example.com/avatar.jpg"
          />

          {profile?.role === 'influencer' && (
            <>
              <Input
                label="Follower Count"
                type="number"
                value={formData.follower_count}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    follower_count: parseInt(e.target.value) || 0,
                  })
                }
              />

              <Input
                label="Engagement Rate (%)"
                type="number"
                step="0.01"
                value={formData.engagement_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    engagement_rate: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </>
          )}

          {profile?.role === 'brand' && (
            <>
              <Input
                label="Company Name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
              />

              <Input
                label="Industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />

              <Input
                label="Website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://yourbrand.com"
              />
            </>
          )}

          <Button
            type="submit"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
