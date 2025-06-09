'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Done() {
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('lttrbxdFrdFileData');
    if (storedData) {
      localStorage.removeItem('lttrbxdFrdFileData');
    }
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="relative isolate pt-14">
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
                All Done!
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                Share the generated csv file with your friend and ask them to import it on <a 
                  href="https://letterboxd.com/import/" 
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  https://letterboxd.com/import
                </a>.
              </p>
              <button 
                onClick={() => router.push('/')} 
                className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center py-2 text-sm text-gray-500">
        Written by <a href="https://letterboxd.com/JackyKLai/" className="text-blue-100 hover:underline">Jacky K. Lai</a>
      </footer>
    </div>
  )
}
