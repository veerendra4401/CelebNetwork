'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiSettings, FiBell, FiSearch } from 'react-icons/fi';

interface FollowedCelebrity {
  id: string;
  name: string;
  category: string;
  country: string;
  recentUpdates: {
    type: 'performance' | 'news';
    title: string;
    date: string;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [followedCelebrities, setFollowedCelebrities] = useState<FollowedCelebrity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchFollowedCelebrities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/fans/${user.id}/following`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch followed celebrities');
        }

        const data = await response.json();
        setFollowedCelebrities(data);
      } catch (error) {
        console.error('Error fetching followed celebrities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedCelebrities();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-6"
    >
      {/* Welcome Section */}
      <motion.section 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-indigo-100">
          Here's what's happening with your favorite celebrities.
        </p>
      </motion.section>

      {/* Followed Celebrities */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            <FiStar className="text-indigo-500" /> Followed Celebrities
          </h2>
          <Link
            href="/celebrities"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <FiSearch size={14} /> Discover more
          </Link>
        </div>
        
        {followedCelebrities.length === 0 ? (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-xl shadow-md text-center border-2 border-dashed border-gray-200"
          >
            <p className="text-gray-600 mb-4">
              You haven't followed any celebrities yet.
            </p>
            <Link
              href="/celebrities"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explore Celebrities
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedCelebrities.map((celebrity, index) => (
              <motion.div
                key={celebrity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{celebrity.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {celebrity.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {celebrity.country}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/celebrities/${celebrity.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                    >
                      View <span className="hidden sm:inline">Profile</span>
                    </Link>
                  </div>

                  <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Recent Updates</h4>
                    {(celebrity.recentUpdates || []).map((update, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        className="flex items-start space-x-3 text-sm p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span
                          className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            update.type === 'performance'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{update.title}</p>
                          <p className="text-gray-500 text-xs">{update.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <motion.div whileHover={{ y: -5 }}>
          <Link
            href="/celebrities"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col h-full border-l-4 border-indigo-500"
          >
            <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <FiSearch className="text-indigo-600" size={20} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Discover More</h3>
            <p className="text-sm text-gray-600 flex-grow">
              Find new celebrities to follow based on your interests.
            </p>
            <span className="text-indigo-600 text-sm font-medium mt-2 inline-flex items-center">
              Explore now →
            </span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Link
            href="/settings"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col h-full border-l-4 border-purple-500"
          >
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <FiSettings className="text-purple-600" size={20} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Profile Settings</h3>
            <p className="text-sm text-gray-600 flex-grow">
              Update your profile and notification preferences.
            </p>
            <span className="text-purple-600 text-sm font-medium mt-2 inline-flex items-center">
              Manage settings →
            </span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Link
            href="/notifications"
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col h-full border-l-4 border-pink-500"
          >
            <div className="bg-pink-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <FiBell className="text-pink-600" size={20} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Notifications</h3>
            <p className="text-sm text-gray-600 flex-grow">
              Manage your email and push notification settings.
            </p>
            <span className="text-pink-600 text-sm font-medium mt-2 inline-flex items-center">
              View notifications →
            </span>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}