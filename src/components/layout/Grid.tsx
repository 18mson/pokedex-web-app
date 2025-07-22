'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { PokemonCard } from '../card/Card';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { Pokemon, usePokedexStore } from '@/lib/store';
import { GET_POKEMON_COUNT, GET_POKEMON_LIST } from '@/lib/graphql/queries';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';


interface whereClause {
  name?: { _ilike: string };
  pokemon_v2_pokemontypes?: {
    pokemon_v2_type?: {
      name?: { _in: string[] };
    };
  };
  pokemon_v2_pokemonspecy?: {
    pokemon_v2_generation?: {
      id?: { _eq: number | null };
    };
  };
  pokemon_v2_pokemonstats?: {
    pokemon_v2_stat?: {
      name?: { _eq: string };
    };
  };
  pokemon_v2_pokemon_aggregate?: {
    aggregate?: {
      count?: number;
    };
  };
}

export function Grid() {
  const {
    searchTerm,
    selectedTypes,
    selectedGeneration,
    sortBy,
    sortOrder,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalCount,
    setTotalCount,
    viewMode,
  } = usePokedexStore();

  const whereClause = useMemo(() => {
    const conditions: whereClause = {};
    
    if (searchTerm) {
      conditions.name = { _ilike: `%${searchTerm}%` };
    }
    
    if (selectedTypes.length > 0) {
      conditions.pokemon_v2_pokemontypes = {
        pokemon_v2_type: {
          name: { _in: selectedTypes }
        }
      };
    }
    
    if (selectedGeneration) {
      conditions.pokemon_v2_pokemonspecy = {
        pokemon_v2_generation: {
          id: { _eq: selectedGeneration }
        }
      };
    }
    
    return Object.keys(conditions).length > 0 ? conditions : undefined;
  }, [searchTerm, selectedTypes, selectedGeneration]);

    const orderByClause = useMemo(() => {
    const orderMap: Record<string, string> = {
      id: 'id',
      name: 'name',
      height: 'height',
      weight: 'weight'
    };
    
    return [{ [orderMap[sortBy]]: sortOrder }];
  }, [sortBy, sortOrder]);

  const { loading: loadingTotal } = useQuery(GET_POKEMON_COUNT, {
    variables: { where: whereClause },
    onCompleted: (data) => {
      setTotalCount(data.pokemon_v2_pokemon_aggregate.aggregate.count);
    }
  });

  const { data, loading, error } = useQuery(GET_POKEMON_LIST, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      where: whereClause,
      order_by: orderByClause
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  const displayedPokemon = data?.pokemon_v2_pokemon || [];
  const totalPages = Math.ceil(totalCount / pageSize);

    // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTypes, selectedGeneration, sortBy, sortOrder, setCurrentPage]);

  // Reset to page 1 when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

    const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading Pokemon...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading Pokemon</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (displayedPokemon.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Pokemon found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className={cn(
              'px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              'focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            )}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        {!loadingTotal && <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {totalCount} Pokemon
        </div>}
      </div>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {displayedPokemon.map((pokemon: Pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            viewMode={viewMode}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          {/* Page Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} Pokemon
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors duration-200',
                currentPage === 1
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="px-2 text-gray-400 dark:text-gray-600">...</span>
                  )}
                </>
              )}

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    'px-3 py-2 rounded-lg font-medium transition-colors duration-200',
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                  )}
                >
                  {pageNum}
                </button>
              ))}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 text-gray-400 dark:text-gray-600">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors duration-200',
                currentPage === totalPages
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
              )}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}