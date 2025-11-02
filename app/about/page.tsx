import Link from 'next/link'
import CrownIcon from '@/app/components/CrownIcon'

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="section-container py-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <span className="inline-block bg-blush text-rose px-3 py-1 rounded-full text-sm font-medium">Our Story</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">About Glamify Crowns</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Glamify Crowns began as a small studio crafting handcrafted tiaras and crowns for
              brides, performers, and anyone who wants to feel extraordinary. Every piece is designed
              with intention and finished by hand — because the details matter.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
            <p className="text-gray-600">
              To create heirloom-quality pieces that help you celebrate life’s moments with confidence
              and joy. We source thoughtful materials, prioritise comfort, and stand behind our work.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">Meet the Founder</h2>
            <p className="text-gray-600">
              Hi — I’m the founder and maker behind Glamify. I started creating crowns as a way to
              combine a love of vintage design with modern comfort. Each crown is a small act of
              celebration meant to make you feel seen.
            </p>

            <div className="flex gap-4 mt-4">
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                Shop Collection
              </Link>
              <Link href="/" className="btn-outline inline-flex items-center gap-2">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="rounded-3xl p-8 bg-gradient-to-br from-blush/20 to-sage/20 flex items-center justify-center shadow-soft">
            <div className="text-center">
              <CrownIcon size={220} variant="gradient" animated={false} />
              <p className="mt-6 text-sm text-gray-500">Handcrafted with care in small batches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
