'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { PokemonCard } from '../card/Card';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { Pokemon, usePokedexStore } from '@/lib/store';
import { GET_POKEMON_LIST } from '@/lib/graphql/queries';
import { filterPokemon, sortPokemon } from '@/lib/utils/pokemon';

const POKEMON_PER_PAGE = 20;

export function Grid() {
  const {
    searchTerm,
    selectedTypes,
    selectedGeneration,
    sortBy,
    sortOrder,
    allPokemon,
    setAllPokemon,
    filteredPokemon,
    setFilteredPokemon,
    viewMode,
  } = usePokedexStore();

  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, fetchMore } = useQuery(GET_POKEMON_LIST, {
    variables: { limit: POKEMON_PER_PAGE, offset: 0 },
    onCompleted: (data) => {
      if (data.pokemon_v2_pokemon) {
        setAllPokemon(data.pokemon_v2_pokemon);
      }
    },
  });

  // Filter and sort Pokemon whenever dependencies change
  useEffect(() => {
    if (allPokemon.length > 0) {
      let filtered = filterPokemon(allPokemon, searchTerm, selectedTypes, selectedGeneration);
      filtered = sortPokemon(filtered, sortBy, sortOrder);
      setFilteredPokemon(filtered);
    }
  }, [allPokemon, searchTerm, selectedTypes, selectedGeneration, sortBy, sortOrder, setFilteredPokemon]);

  // Update displayed Pokemon for pagination
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * POKEMON_PER_PAGE;
    const newDisplayed = filteredPokemon.slice(startIndex, endIndex);
    setDisplayedPokemon(newDisplayed);
    setHasMore(endIndex < filteredPokemon.length);
  }, [filteredPokemon, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedTypes, selectedGeneration, sortBy, sortOrder]);

  const loadMore = async () => {
    if (page * POKEMON_PER_PAGE >= allPokemon.length && hasMore) {
      // Need to fetch more Pokemon from API
      try {
        const result = await fetchMore({
          variables: {
            offset: allPokemon.length,
            limit: POKEMON_PER_PAGE,
          },
        });
        
        if (result.data.pokemon_v2_pokemon.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error loading more Pokemon:', err);
        setHasMore(false);
      }
    } else {
      // Just show more from already loaded Pokemon
      setPage(prev => prev + 1);
    }
  };

  if (loading && allPokemon.length === 0) {
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

  if (filteredPokemon.length === 0 && !loading) {
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
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }
      >
        {displayedPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            className={viewMode === 'list' ? 'max-w-sm' : ''}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && displayedPokemon.length < filteredPokemon.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Load More Pokemon
          </button>
        </div>
      )}
    </>
  );
}