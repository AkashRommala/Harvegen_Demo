'use client'

/**
 * Skeleton loading components for professional UX during data fetching.
 * Each skeleton mirrors the real component's layout.
 */

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-[200px] bg-gray-200" />
      <div className="p-6 pb-0">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-lg" />
          <div className="h-6 w-14 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-5 bg-gray-200 rounded-lg mb-3 w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded-lg" />
          <div className="h-3 bg-gray-100 rounded-lg w-4/5" />
        </div>
      </div>
      <div className="p-6 flex justify-between items-center border-t border-gray-100 bg-gray-50/50 mt-4">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

export function TutorialCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-[160px] bg-gray-200" />
      <div className="p-5">
        <div className="h-6 w-20 bg-gray-200 rounded-lg mb-3" />
        <div className="h-5 bg-gray-200 rounded-lg mb-2 w-3/4" />
        <div className="h-3 bg-gray-100 rounded-lg mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ResourceRowSkeleton() {
  return (
    <div className="flex items-center gap-6 bg-white border border-gray-200 rounded-2xl p-8 shadow-md animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-2/3" />
        <div className="h-3 bg-gray-100 rounded-lg w-full" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => <div key={i} className="h-6 w-14 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function HeroSliderSkeleton() {
  return (
    <section className="relative min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-8 w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-40 bg-gray-700 rounded" />
          <div className="h-16 w-2/3 bg-gray-800 rounded-xl" />
          <div className="h-6 w-1/2 bg-gray-800 rounded-xl" />
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-gray-700 rounded-xl" />
            <div className="h-12 w-40 bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
