'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center h-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-white hover:text-indigo-200 transition-colors duration-300 flex items-center"
            >
              <span className="mr-2">🌟</span>
              CelebNetwork
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-6"
          >
            <Link 
              href="/celebrities" 
              className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-indigo-700 hover:scale-105"
            >
              Discover
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-indigo-700 hover:scale-105"
                >
                  Dashboard
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-rose-600"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-indigo-700 hover:scale-105"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/register"
                    className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium shadow-md hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </nav>
  );
}