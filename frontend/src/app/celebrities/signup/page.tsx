'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CelebrityDetails {
  name: string;
  category: 'SINGER' | 'ACTOR' | 'SPEAKER';
  country: string;
  instagramUrl: string;
  fanbase: number;
  description: string;
  genres: string[];
  socialStats: {
    instagram?: number;
    youtube?: number;
    spotify?: number;
    imdb?: number;
  };
}

export default function CelebritySignupPage() {
  const router = useRouter();
  const [introduction, setIntroduction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<Partial<CelebrityDetails>>({});
  const [step, setStep] = useState<'intro' | 'details'>('intro');

  const handleAutoFill = async () => {
    if (!introduction.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/celebrities/autofill/${encodeURIComponent(introduction)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to auto-fill details');
      }

      const data = await response.json();
      setDetails(data);
      setStep('details');
    } catch (error) {
      console.error('Error auto-filling details:', error);
      alert('Failed to auto-fill details. Please try again or fill them manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/celebrities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Create Your Celebrity Profile</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-6">
              Enter a brief introduction about yourself, and we'll use AI to auto-fill your profile details.
              For example: "Taylor Swift is an American singer-songwriter known for hits like Shake It Off"
            </p>

            <div className="space-y-4">
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Enter a brief introduction..."
                className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                onClick={handleAutoFill}
                disabled={isLoading || !introduction.trim()}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Auto-filling...' : 'Auto-fill Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={details.name || ''}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={details.category || ''}
              onChange={(e) => setDetails({ ...details, category: e.target.value as CelebrityDetails['category'] })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select category</option>
              <option value="SINGER">Singer</option>
              <option value="ACTOR">Actor</option>
              <option value="SPEAKER">Speaker</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={details.country || ''}
              onChange={(e) => setDetails({ ...details, country: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={details.instagramUrl || ''}
              onChange={(e) => setDetails({ ...details, instagramUrl: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={details.description || ''}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
              className="w-full h-32 p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genres/Tags (comma-separated)</label>
            <input
              type="text"
              value={details.genres?.join(', ') || ''}
              onChange={(e) => setDetails({ ...details, genres: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2 border rounded-md"
              placeholder="Pop, Rock, Drama"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
