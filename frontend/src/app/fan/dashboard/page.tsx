'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWithAuth } from '@/utils/api';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  country: string;
  description: string;
  recentPerformances?: {
    venue: string;
    date: string;
    location: string;
  }[];
}

export default function FanDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [followedCelebrities, setFollowedCelebrities] = useState<Celebrity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedCelebrities = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const data = await fetchWithAuth(`/fans/${user.id}/following`);
        setFollowedCelebrities(data);
      } catch (error) {
        console.error('Error fetching followed celebrities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedCelebrities();
  }, [user, router]);

  const handleUnfollow = async (celebrityId: string) => {
    if (!user) return;

    try {
      await fetchWithAuth(`/fans/${user.id}/unfollow/${celebrityId}`, {
        method: 'DELETE',
      });

      setFollowedCelebrities((prev) =>
        prev.filter((celebrity) => celebrity.id !== celebrityId)
      );
    } catch (error) {
      console.error('Error unfollowing celebrity:', error);
      alert('Failed to unfollow celebrity. Please try again.');
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Following</h1>
          <Link
            href="/celebrities"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Discover More
          </Link>
        </div>

        {followedCelebrities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">You're not following any celebrities yet!</h2>
            <p className="text-gray-600 mb-6">
              Follow your favorite celebrities to stay updated with their latest activities.
            </p>
            <Link
              href="/celebrities"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 inline-block"
            >
              Browse Celebrities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedCelebrities.map((celebrity) => (
              <div
                key={celebrity.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{celebrity.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {celebrity.category}
                        </span>
                        <span>{celebrity.country}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnfollow(celebrity.id)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      Unfollow
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{celebrity.description}</p>

                  {celebrity.recentPerformances && celebrity.recentPerformances.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recent Performance</h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{celebrity.recentPerformances[0].venue}</p>
                        <p>{celebrity.recentPerformances[0].location}</p>
                        <p>{new Date(celebrity.recentPerformances[0].date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/celebrities/${celebrity.id}`}
                    className="mt-4 text-blue-500 hover:text-blue-600 font-medium inline-block"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 