'use client'

import { useRouter } from 'next/navigation'

export default function SelectionPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        <div
          onClick={() => router.push('/select-movies')}
          className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-center p-8 rounded-lg shadow-lg transition duration-300"
        >
          <h2 className="text-2xl font-bold mb-4">Select Movies Myself</h2>
          <p className="text-gray-300">Manually choose the movies you want to include.</p>
        </div>
        <div
          onClick={() => router.push('/use-tags')}
          className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-center p-8 rounded-lg shadow-lg transition duration-300"
        >
          <h2 className="text-2xl font-bold mb-4">Use Tags</h2>
          <p className="text-gray-300">Filter and select movies based on tags.</p>
        </div>
      </div>
    </div>
  );
}
