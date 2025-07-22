'use client';

import { useQuery } from '@apollo/client';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { usePokedexStore } from '@/lib/store';
import { GET_POKEMON_TYPES } from '@/lib/graphql/queries';
import { getTypeColor, formatPokemonName } from '@/lib/utils/pokemon';
import { cn } from '@/lib/utils';

export function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    selectedTypes,
    setSelectedTypes,
    selectedGeneration,
    setSelectedGeneration,
    sortBy,
    sortOrder,
    setSorting,
    clearFilters,
  } = usePokedexStore();

  const { data: typesData } = useQuery(GET_POKEMON_TYPES);

  const handleTypeToggle = (typeName: string) => {
    if (selectedTypes.includes(typeName)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeName));
    } else {
      setSelectedTypes([...selectedTypes, typeName]);
    }
    setIsOpen(false);
  };

  const generations = [
    { id: 1, name: 'Generation I (Kanto)' },
    { id: 2, name: 'Generation II (Johto)' },
    { id: 3, name: 'Generation III (Hoenn)' },
    { id: 4, name: 'Generation IV (Sinnoh)' },
    { id: 5, name: 'Generation V (Unova)' },
    { id: 6, name: 'Generation VI (Kalos)' },
    { id: 7, name: 'Generation VII (Alola)' },
    { id: 8, name: 'Generation VIII (Galar)' },
  ];

  const hasActiveFilters = selectedTypes.length > 0 || selectedGeneration !== null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border h-[50px]',
          'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
          'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
          'transition-colors duration-200',
          hasActiveFilters && 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
        )}
      >
        <Filter className="w-4 h-4" />
        {hasActiveFilters && (
          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {selectedTypes.length + (selectedGeneration ? 1 : 0)}
          </span>
        )}
      </button>
      <div
        className={cn(
          'absolute lg:relative top-full lg:top-auto left-0 right-0 z-20',
          'w-[calc(100vw-2em)] lg:w-fit',
          'max-h-[calc(100vh-150px)] lg:max-h-none',
          'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg lg:shadow-none',
          'p-4 space-y-6 mt-2 lg:mt-0 overflow-y-auto',
          isOpen ? 'block' : 'hidden lg:block'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Clear All
            </button>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Types</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {typesData?.pokemon_v2_type.map((type: { name: string }) => (
              <button
                key={type.name}
                onClick={() => handleTypeToggle(type.name)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'border-2 border-transparent',
                  selectedTypes.includes(type.name)
                    ? 'text-white shadow-md scale-105'
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
                style={{
                  backgroundColor: selectedTypes.includes(type.name) ? getTypeColor(type.name) : undefined,
                }}
              >
                {formatPokemonName(type.name)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Generation</h4>
          <select
            value={selectedGeneration || ''}
            onChange={(e) => {
              setSelectedGeneration(e.target.value ? parseInt(e.target.value) : null)
              setIsOpen(false);
            }}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
              'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            )}
          >
            <option value="">All Generations</option>
            {generations.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Sort By</h4>
          <div className="space-y-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSorting(e.target.value as 'id' | 'name' | 'height' | 'weight' | 'basebase_stat', sortOrder)
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              )}
            >
              <option value="id">Pokedex Number</option>
              <option value="name">Name</option>
              <option value="height">Height</option>
              <option value="weight">Weight</option>
              <option value="base_stat">Total Stats</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSorting(sortBy, 'asc')
                  setIsOpen(false);
                }}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  sortOrder === 'asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                Ascending
              </button>
              <button
                onClick={() => {
                  setSorting(sortBy, 'desc')
                  setIsOpen(false);
                }}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  sortOrder === 'desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                Descending
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}