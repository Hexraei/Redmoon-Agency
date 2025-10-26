import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">REDMOON AGENCY</h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            The premier platform connecting influencers and brands, with agency
            oversight every step of the way.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="text-white border border-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
