'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { useRouter } from 'next/navigation'
import { collectTags } from '@/utils/helpers'

export default function Home() {
  const router = useRouter();
  const [fileData, setFileData] = useState<any[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3500); // Hide alert after 3.5 seconds
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    type DiaryEntry = {
      'Watched Date': string;
      'Tags': string;
      'Letterboxd URI': string;
      'Year': string;
      'Name': string;
    }

    const expectedHeaders = [
        "Date",
        "Name",
        "Year",
        "Letterboxd URI",
        "Rating",
        "Rewatch",
        "Tags",
        "Watched Date"
    ]
   
    if (file) {
      if (file.name !== 'diary.csv') {
        showAlert('Please only upload the file named diary.csv')
        e.target.value = '' // Reset the input
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const parsedData = Papa.parse<DiaryEntry>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.meta?.fields?.toSorted().toString() !== expectedHeaders.toSorted().toString()) {
              showAlert('The file does not match the expected format. Please ensure it is the correct diary.csv file from Letterboxd.')
              e.target.value = '' // Reset the input
              return
            }
            localStorage.setItem('fileData', JSON.stringify(results.data));
            setFileData(results.data);
            console.log('Parsed Data:', results.data);
          }
        })
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem('fileData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const tags = collectTags(parsedData);
      if (tags.length > 0) {
        router.push('/selection-page');
      } else {
        router.push('/select-movies');
      }
    }
  }, [fileData, router]);

  return (
    <div className="bg-gray-800 min-h-screen">
      {alertVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div>
            <span className="font-medium">{alertMessage}</span>
          </div>
        </div>
      )}
      <div className="relative isolate pt-14">
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
                Get a friend started with Letterboxd
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                Have you logged your watches with someone who’s not on Letterboxd? Help them get started using your Letterboxd data!
                Export your data <a 
                  href="https://letterboxd.com/data/export/" 
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  here
                </a> and import the diary.csv file below.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <label htmlFor="uploadFile1"
                  className="text-center rounded w-full max-w-sm min-h-[180px] py-4 px-4 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 mb-6 fill-gray-400" viewBox="0 0 24 24">
                    <path
                      d="M22 13a1 1 0 0 0-1 1v4.213A2.79 2.79 0 0 1 18.213 21H5.787A2.79 2.79 0 0 1 3 18.213V14a1 1 0 0 0-2 0v4.213A4.792 4.792 0 0 0 5.787 23h12.426A4.792 4.792 0 0 0 23 18.213V14a1 1 0 0 0-1-1Z"
                      data-original="#000000" />
                    <path
                      d="M6.707 8.707 11 4.414V17a1 1 0 0 0 2 0V4.414l4.293 4.293a1 1 0 0 0 1.414-1.414l-6-6a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 1.414 1.414Z"
                      data-original="#000000" />
                  </svg>
                  <p className="text-gray-400 font-semibold text-sm">Drag & Drop or <span className="text-blue-400">Choose file</span> to
                    upload</p>
                  <input 
                    type="file" 
                    id="uploadFile1" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                  <p className="text-xs text-gray-500 mt-2">Only upload the diary.csv file</p>
                </label>
              </div>
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
