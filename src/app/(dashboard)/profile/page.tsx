import { ProfileEditor } from '@/components/profile/ProfileEditor'

export default function ProfilePage() {
  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      <ProfileEditor />
    </div>
  )
}
