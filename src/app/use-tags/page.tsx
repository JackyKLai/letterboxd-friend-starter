'use client'

import { useEffect, useState } from 'react';
import { collectTags, createCSV } from '@/utils/helpers'; // Import createCSV
import { DiaryEntry } from '@/utils/types';

export default function UseTags() {
  const [fileData, setFileData] = useState<DiaryEntry[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term

  useEffect(() => {
    const storedData = localStorage.getItem('fileData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFileData(parsedData);
      setTags(collectTags(parsedData));
    } else {
        window.location.href = '/';
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, tag: string) => {
    e.dataTransfer.setData('text/plain', tag);
  };

  const handleDrop = (e: React.DragEvent) => {
    const tag = e.dataTransfer.getData('text/plain');
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setTags((prev) => [...prev, tag]);
  };

  const handleFinish = () => {
    const filteredData = fileData.filter((entry) =>
      selectedTags.some((tag) => entry.Tags?.split(', ').includes(tag))
    );
    createCSV(filteredData); // Download the filtered data as CSV
    window.location.href = '/done';
    setFileData([]);
    setTags([]);
    setSelectedTags([]);
  };

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filter tags based on search term

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Use Tags</h1>
      <div className="flex flex-col gap-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-white"
          />
        </div>
        <div
          className="p-4 border-2 border-gray-700 bg-gray-900 rounded min-h-[150px]"
          onDragOver={(e) => e.preventDefault()}
        >
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <span
                key={tag}
                draggable
                onDragStart={(e) => handleDragStart(e, tag)}
                className="px-3 py-1 bg-blue-600 rounded cursor-pointer hover:bg-blue-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-center text-lg font-medium text-gray-400">
          drag to 👇
        </div>
        <div
          className="p-4 border-2 border-gray-700 bg-gray-900 rounded min-h-[150px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <h2 className="text-xl font-semibold mb-4">Selected Tags</h2>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                className="px-3 py-1 bg-green-600 rounded cursor-pointer hover:bg-green-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 rounded hover:bg-blue-500"
          onClick={handleFinish}
        >
          Finish
        </button>
      </div>
    </div>
  );
}
