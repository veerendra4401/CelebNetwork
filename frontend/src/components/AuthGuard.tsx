'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const publicPaths = ['/', '/login', '/register', '/celebrities'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = publicPaths.includes(pathname) || 
                          pathname.startsWith('/celebrities/') && !pathname.includes('/dashboard');

      if (!user && !isPublicPath) {
        // Redirect to login for protected routes when not authenticated
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        // Redirect to dashboard if trying to access login/register while authenticated
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 