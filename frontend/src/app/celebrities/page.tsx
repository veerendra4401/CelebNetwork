'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/api';
// Modal component for AI-only celebrity details
function CelebrityModal({ open, onClose, celebrity }: { open: boolean, onClose: () => void, celebrity: any }) {
  if (!open || !celebrity) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="text-2xl font-bold mb-2">{celebrity.name}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full flex items-center gap-1">{celebrity.category}</span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1">{celebrity.country}</span>
        </div>
        <p className="mb-2 text-gray-700">{celebrity.description}</p>
        {celebrity.socialStats && (
          <div className="mb-2">
            {celebrity.socialStats.instagram && <div>Instagram: {celebrity.socialStats.instagram.toLocaleString()}</div>}
            {celebrity.socialStats.youtube && <div>YouTube: {celebrity.socialStats.youtube.toLocaleString()}</div>}
            {celebrity.socialStats.spotify && <div>Spotify: {celebrity.socialStats.spotify.toLocaleString()}</div>}
          </div>
        )}
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiMusic, FiMapPin, FiInstagram, FiYoutube, FiHeadphones } from 'react-icons/fi';

interface Celebrity {
  id?: string;
  name: string;
  category: string;
  country: string;
  description: string;
  fanbase?: number;
  socialStats?: {
    instagram?: number;
    youtube?: number;
    spotify?: number;
  };
  instagramUrl?: string;
  setlist?: string[];
  genres?: string[];
  recentPerformances?: any[];
}

export default function CelebritiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const [modalCelebrity, setModalCelebrity] = useState<Celebrity | null>(null);
  // Track which celebrities are being onboarded
  const [onboarding, setOnboarding] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const searchCelebrities = async (query: string) => {
    if (!query.trim()) {
      setCelebrities([]);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      console.log('Searching for:', query);
      const response = await fetch(
        `http://localhost:3000/celebrities/suggest?description=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData?.message || `Search failed with status: ${response.status}`);
        } catch (e) {
          throw new Error(`Search failed with status: ${response.status}`);
        }
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response format from server');
      }
      
      if (!Array.isArray(data)) {
        console.error('Response is not an array:', data);
        throw new Error('Invalid response format: expected an array');
      }

      console.log('Parsed celebrities:', data);
      setCelebrities(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search celebrities');
      setCelebrities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for debouncing
    searchTimeout.current = setTimeout(() => {
      searchCelebrities(value);
    }, 500); // 500ms debounce
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Discover Your Favorite Celebrities
        </h1>
        <p className="text-gray-600 text-lg">
          Search for actors, musicians, athletes and more from around the world
        </p>
      </motion.section>

      {/* Search Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="E.g., Punjabi Singer from India who performed at Coachella"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FiSearch /> Search
              </>
            )}
          </motion.button>
        </div>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 font-medium">{error}</p>
            {error.includes('high demand') && (
              <p className="text-sm text-red-500 mt-2">
                The search feature uses AI which requires API credits. Please try again in a few minutes.
              </p>
            )}
          </motion.div>
        )}
      </motion.section>

      {/* Results Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {celebrities.map((celebrity, index) => (
          <motion.div
            key={celebrity.id || celebrity.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{celebrity.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full flex items-center gap-1">
                      <FiMusic size={12} /> {celebrity.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1">
                      <FiMapPin size={12} /> {celebrity.country}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{celebrity.description}</p>
              
              <div className="space-y-3 mb-4">
                {celebrity.socialStats?.instagram && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiInstagram className="text-pink-600" />
                    <span className="text-gray-700">Instagram:</span>
                    <span className="text-gray-900 font-medium">{celebrity.socialStats.instagram.toLocaleString()}</span>
                  </div>
                )}
                {celebrity.socialStats?.youtube && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiYoutube className="text-red-600" />
                    <span className="text-gray-700">YouTube:</span>
                    <span className="text-gray-900 font-medium">{celebrity.socialStats.youtube.toLocaleString()}</span>
                  </div>
                )}
                {celebrity.socialStats?.spotify && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiHeadphones className="text-green-600" />
                    <span className="text-gray-700">Spotify:</span>
                    <span className="text-gray-900 font-medium">{celebrity.socialStats.spotify.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 gap-2">
                {/* Always show View Profile */}
                {celebrity.id ? (
                  <Link
                    href={`/celebrities/${celebrity.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    View Profile
                  </Link>
                ) : (
                  <button
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    onClick={() => setModalCelebrity(celebrity)}
                  >
                    View Profile
                  </button>
                )}
                {/* Always show Follow */}
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
                    disabled={onboarding === celebrity.name}
                    onClick={async () => {
                      if (!celebrity.id) {
                        setOnboarding(celebrity.name);
                        try {
                          // 1. Fetch enriched details from backend autofill endpoint
                          let autofill: Partial<Celebrity> = {};
                          try {
                            autofill = await fetchWithAuth(`/celebrities/autofill/${encodeURIComponent(celebrity.name)}`) as Partial<Celebrity>;
                          } catch (e) {
                            autofill = {};
                          }
                          // 2. Merge autofill data with minimal AI data as fallback
                          const payload = {
                            name: autofill && autofill.name ? autofill.name : celebrity.name,
                            category: autofill && autofill.category ? autofill.category : celebrity.category,
                            country: autofill && autofill.country ? autofill.country : celebrity.country,
                            description: (autofill && autofill.description) ? autofill.description : (celebrity.description || ''),
                            instagramUrl: (autofill && autofill.instagramUrl) ? autofill.instagramUrl : (celebrity.instagramUrl || 'https://instagram.com/unknown'),
                            fanbase: (autofill && autofill.fanbase) ? autofill.fanbase : (celebrity.fanbase || 1000),
                            setlist: (autofill && Array.isArray(autofill.setlist)) ? autofill.setlist : (Array.isArray(celebrity.setlist) ? celebrity.setlist : []),
                            socialStats: (autofill && autofill.socialStats) ? autofill.socialStats : (celebrity.socialStats || {}),
                            genres: (autofill && Array.isArray(autofill.genres)) ? autofill.genres : (Array.isArray(celebrity.genres) ? celebrity.genres : []),
                            recentPerformances: (autofill && Array.isArray(autofill.recentPerformances)) ? autofill.recentPerformances : (Array.isArray(celebrity.recentPerformances) ? celebrity.recentPerformances : []),
                          };
                          // 3. Create celebrity in DB with enriched data
                          const created = await fetchWithAuth('/celebrities', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                          });
                          // Update this celebrity in state with new id
                          setCelebrities(prev => prev.map(c =>
                            c.name === celebrity.name ? { ...c, id: created.id } : c
                          ));
                          alert('Celebrity added to platform with enriched data! You can now follow and view their profile.');
                        } catch (err) {
                          alert('Failed to onboard celebrity: ' + (err as any).message);
                        } finally {
                          setOnboarding(null);
                        }
                      } else {
                        // TODO: Implement follow logic for DB celebrities
                        alert('Followed!');
                      }
                    }}
                  >
                    {onboarding === celebrity.name ? 'Adding...' : 'Follow'}
                  </motion.button>
                )}
              </div>
      {/* Modal for AI-only celebrity details */}
      <CelebrityModal open={!!modalCelebrity} onClose={() => setModalCelebrity(null)} celebrity={modalCelebrity} />
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Empty State */}
      {celebrities.length === 0 && !isLoading && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {searchQuery ? 'No results found' : 'Discover Celebrities'}
            </h3>
          <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search query or use different keywords.'
                : 'Enter a description to find celebrities that match your interests.'}
            </p>
            {!searchQuery && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Try searches like:</p>
                <ul className="space-y-1 mt-2">
                  <li>"Bollywood actors under 30"</li>
                  <li>"Latin pop singers"</li>
                  <li>"NBA players from Europe"</li>
                </ul>
              </div>
            )}
        </div>
        </motion.div>
      )}
    </div>
  );
} 