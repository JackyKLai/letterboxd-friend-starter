'use client'

import { useEffect, useState } from 'react';
import { createCSV } from '@/utils/helpers';
import type { DiaryEntry } from '@/utils/types'
import { useRouter } from 'next/navigation'

export default function SelectMovies() {
  const router = useRouter();
  const [fileData, setFileData] = useState<DiaryEntry[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedData = localStorage.getItem('lttrbxdFrdFileData');
    if (storedData) {
      setFileData(JSON.parse(storedData));
    } else {
      router.push('/');
    }
  }, []);

  const toggleSelection = (index: number) => {
    setSelectedMovies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleFinish = () => {
    const selected = fileData.filter((_, index) => selectedMovies.has(index));
    createCSV(selected); // Download the selected movies as CSV
    setFileData([]);
    setSelectedMovies(new Set());
    router.push('/done');
  };

  const handleStartOver = () => {
    localStorage.removeItem('lttrbxdFrdFileData');
    router.push('/');
  };

  const paginatedData = fileData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(fileData.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Select Movies</h1>
      {fileData.length > 0 ? (
        <>
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 px-4 py-2">Select</th>
                <th className="border border-gray-700 px-4 py-2">Film</th>
                <th className="border border-gray-700 px-4 py-2">Watched Date</th>
                <th className="border border-gray-700 px-4 py-2">Tags</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((movie, index) => (
                <tr key={index}>
                  <td className="border border-gray-700 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMovies.has(
                        (currentPage - 1) * itemsPerPage + index
                      )}
                      onChange={() =>
                        toggleSelection(
                          (currentPage - 1) * itemsPerPage + index
                        )
                      }
                    />
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{movie.Name} ({movie.Year})</td>
                  <td className="border border-gray-700 px-4 py-2">{movie['Watched Date']}</td>
                  <td className="border border-gray-700 px-4 py-2">{movie.Tags}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500"
              onClick={handleFinish}
            >
              Finish
            </button>
            <button
              className="ml-4 px-6 py-2 bg-red-600 rounded hover:bg-red-500"
              onClick={handleStartOver}
            >
              Start Over
            </button>
          </div>
        </>
      ) : (
        <p>No data available. Please upload a file first.</p>
      )}
    </div>
  );
}
