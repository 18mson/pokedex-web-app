'use client';

import Link from 'next/link';
import { Moon, Sun, Grid, List, Search } from 'lucide-react';
import { usePokedexStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, toggleTheme, viewMode, setViewMode } = usePokedexStore();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Pokédex
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors duration-200',
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}