'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { usePokedexStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function SearchBar() {
  const { searchTerm, setSearchTerm } = usePokedexStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  const handleClear = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 " />
        <input
          type="text"
          placeholder="Search Pokemon by name..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600',
            'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'transition-all duration-200',
            'backdrop-blur'
          )}
        />
        {localSearchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}