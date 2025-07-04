'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchWithAuth } from '@/utils/api';
import SearchBar from '@/components/SearchBar';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  country: string;
  description: string;
  fanbase: number;
}

export default function HomePage() {
  const router = useRouter();
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const data = await fetchWithAuth('/celebrities');
        setCelebrities(data);
      } catch (err) {
        setError('Failed to load celebrities');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCelebrities();
  }, []);

  const handleCelebritySelect = (celebrity: Celebrity) => {
    router.push(`/celebrities/${celebrity.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Celebrities</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find and follow your favorite celebrities from various categories
          </p>
          <SearchBar onSelect={handleCelebritySelect} />
        </div>

        {error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : celebrities.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No celebrities found</p>
            <Link
              href="/celebrities/signup"
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Add Celebrity
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {celebrities.map((celebrity) => (
              <Link
                key={celebrity.id}
                href={`/celebrities/${celebrity.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{celebrity.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {celebrity.category}
                    </span>
                    <span className="text-sm text-gray-600">{celebrity.country}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{celebrity.description}</p>
                  <div className="text-sm text-gray-500">
                    {celebrity.fanbase.toLocaleString()} fans
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
