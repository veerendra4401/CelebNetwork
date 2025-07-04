'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/utils/api';
import PDFDownloadButton from '@/components/PDFDownloadButton';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  country: string;
  instagramUrl: string;
  fanbase: number;
  description: string;
  genres: string[];
  setlist?: string[];
  socialStats: {
    instagram?: number;
    youtube?: number;
    spotify?: number;
  };
  recentPerformances?: {
    venue: string;
    date: string;
    location: string;
  }[];
}

export default function CelebrityProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        const data = await fetchWithAuth(`/celebrities/${params.id}`);
        setCelebrity(data);

        // Check if user is following this celebrity
        if (user) {
          const followingData = await fetchWithAuth(`/fans/${user.id}/following`);
          setIsFollowing(followingData.some((c: Celebrity) => c.id === params.id));
        }
      } catch (err) {
        setError('Failed to load celebrity profile');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCelebrity();
    }
  }, [params.id, user]);

  const handleFollowToggle = async () => {
    if (!user || !celebrity) return;

    try {
      if (isFollowing) {
        await fetchWithAuth(`/fans/${user.id}/unfollow/${celebrity.id}`, {
          method: 'DELETE',
        });
      } else {
        await fetchWithAuth(`/fans/${user.id}/follow/${celebrity.id}`, {
          method: 'POST',
        });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert('Failed to update following status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !celebrity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Celebrity not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{celebrity.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {celebrity.category}
                  </span>
                  <span>{celebrity.country}</span>
                  <span>{celebrity.fanbase.toLocaleString()} fans</span>
                </div>
              </div>
              <div className="flex gap-4">
                {user && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-md ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
                <PDFDownloadButton celebrityId={celebrity.id} celebrityName={celebrity.name} />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {/* Left Column - About & Genres */}
            <div className="md:col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-line">{celebrity.description}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {celebrity.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </section>

              {celebrity.setlist && celebrity.setlist.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Popular Works</h2>
                  <ul className="list-disc list-inside text-gray-600">
                    {celebrity.setlist.map((item, index) => (
                      <li key={index} className="mb-2">{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right Column - Social Stats & Recent Performances */}
            <div>
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Social Media</h2>
                <div className="space-y-4">
                  {celebrity.socialStats.instagram && (
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                      <h3 className="font-semibold mb-2">Instagram</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm opacity-75">Followers</p>
                          <p className="font-bold">
                            {celebrity.socialStats.instagram.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={celebrity.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm hover:underline"
                      >
                        View Profile →
                      </a>
                    </div>
                  )}

                  {celebrity.socialStats.youtube && (
                    <div className="p-4 bg-red-600 text-white rounded-lg">
                      <h3 className="font-semibold mb-2">YouTube</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm opacity-75">Subscribers</p>
                          <p className="font-bold">
                            {celebrity.socialStats.youtube.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {celebrity.socialStats.spotify && (
                    <div className="p-4 bg-green-600 text-white rounded-lg">
                      <h3 className="font-semibold mb-2">Spotify</h3>
                      <div className="mb-4">
                        <p className="text-sm opacity-75">Monthly Listeners</p>
                        <p className="font-bold">
                          {celebrity.socialStats.spotify.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {celebrity.recentPerformances && celebrity.recentPerformances.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Recent Performances</h2>
                  <div className="space-y-4">
                    {celebrity.recentPerformances.map((performance, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <h3 className="font-semibold mb-1">{performance.venue}</h3>
                        <p className="text-gray-600">{performance.location}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(performance.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
