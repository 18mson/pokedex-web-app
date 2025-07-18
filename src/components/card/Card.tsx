'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Minus } from 'lucide-react';
import { Pokemon, usePokedexStore } from '@/lib/store';
import { getPokemonImageUrl, getTypeColor, formatPokemonName } from '@/lib/utils/pokemon';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: Pokemon;
  className?: string;
}

export function PokemonCard({ pokemon, className }: PokemonCardProps) {
  const {
    favorites,
    toggleFavorite,
    comparisonPokemon,
    addToComparison,
    removeFromComparison,
  } = usePokedexStore();

  const isFavorite = favorites.includes(pokemon.id);
  const isInComparison = comparisonPokemon.some(p => p.id === pokemon.id);
  const canAddToComparison = comparisonPokemon.length < 4;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison) {
      removeFromComparison(pokemon.id);
    } else if (canAddToComparison) {
      addToComparison(pokemon);
    }
  };

  const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name;
  const typeColor = primaryType ? getTypeColor(primaryType) : '#68A090';

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div
        className={cn(
          'group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700',
          'hover:scale-105 hover:-translate-y-1',
        )}
        style={{
          background: `linear-gradient(135deg, ${typeColor}20 0%, transparent 50%)`,
        }}
      >
        <button
          onClick={handleToggleFavorite}
          className={cn(
            'absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-200',
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
            'hover:bg-white dark:hover:bg-gray-700',
            isFavorite ? 'text-red-500' : 'text-gray-400'
          )}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>

        <button
          onClick={handleToggleComparison}
          disabled={!isInComparison && !canAddToComparison}
          className={cn(
            'absolute top-3 left-3 z-10 p-1.5 rounded-full transition-all duration-200',
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
            'hover:bg-white dark:hover:bg-gray-700',
            isInComparison ? 'text-blue-500' : 'text-gray-400',
            !isInComparison && !canAddToComparison && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isInComparison ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>

        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>
        <div className={className}>
          <div className="relative h-48 flex items-center justify-center p-4">
            <Image
              src={getPokemonImageUrl(pokemon.id)}
              alt={formatPokemonName(pokemon.name)}
              width={120}
              height={120}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          <div className="p-4 pt-0 flex-1/2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              {formatPokemonName(pokemon.name)}
            </h3>

            <div className="flex gap-1 mb-3">
              {pokemon.pokemon_v2_pokemontypes.map((typeInfo) => (
                <span
                  key={typeInfo.pokemon_v2_type.name}
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getTypeColor(typeInfo.pokemon_v2_type.name) }}
                >
                  {formatPokemonName(typeInfo.pokemon_v2_type.name)}
                </span>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Height:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(pokemon.height / 10).toFixed(1)}m
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(pokemon.weight / 10).toFixed(1)}kg
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}