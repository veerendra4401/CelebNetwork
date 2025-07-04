'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/utils/api';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  country: string;
  description: string;
  fanbase: number;
}

interface SearchBarProps {
  onSelect: (celebrity: Celebrity) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Celebrity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchWithAuth(`/celebrities/suggest?query=${encodeURIComponent(query)}`);
      setSuggestions(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        setError('AI suggestions are temporarily unavailable. Please try again later.');
      } else {
        setError('Failed to fetch suggestions. Please try again.');
      }
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for a celebrity..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200">
          {suggestions.map((celebrity) => (
            <div
              key={celebrity.id}
              onClick={() => onSelect(celebrity)}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <h3 className="font-medium">{celebrity.name}</h3>
              <div className="flex gap-2 text-sm text-gray-600 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {celebrity.category}
                </span>
                <span>{celebrity.country}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {celebrity.description}
              </p>
              <div className="text-sm text-gray-500 mt-2">
                {celebrity.fanbase.toLocaleString()} fans
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 