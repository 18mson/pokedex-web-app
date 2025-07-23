'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Minus } from 'lucide-react';
import { usePokedexStore } from '@/lib/store';
import { getPokemonImageUrl, getTypeColor, formatPokemonName } from '@/lib/utils/pokemon';
import { cn } from '@/lib/utils';
import { Pokemon } from '@/lib/types';

interface PokemonCardProps {
  pokemon: Pokemon;
  viewMode: 'grid' | 'list';
}

export function PokemonCard({ pokemon, viewMode }: PokemonCardProps) {
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
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
          aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
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
        <div className={cn(
          viewMode === 'list' ? 'flex w-full justify-between items-center pt-12 lg:pt-8' : ''
        )
        }>
          <div className="relative h-48 flex items-center justify-center p-4">
            <Image
              src={getPokemonImageUrl(pokemon.id)}
              alt={formatPokemonName(pokemon.name)}
              width={120}
              height={120}
              className="object-contain group-hover:scale-110 transition-transform duration-300 rounded-xl"
              loading="lazy"
              priority={false}
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

            <div className={cn("space-y-1",
              viewMode === 'list' ? 'flex flex-row space-x-4 items-center' : ''
            )}>
              <div className="grid grid-cols-2 gap-2 justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Height:</span>
                <span className="font-medium text-gray-900 dark:text-white text-end">
                  {(pokemon.height / 10).toFixed(1)}m
                </span>
                <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                <span className="font-medium text-gray-900 dark:text-white text-end">
                  {(pokemon.weight / 10).toFixed(1)}kg
                </span>
              </div>

              {/* Basic Stats Preview */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex-1">
                <div className={cn("gap-2 text-xs",
                  viewMode === 'list' ? 'flex flex-col text-start' : 'grid grid-cols-3'
                )}>
                  {pokemon.pokemon_v2_pokemonstats.slice(0, 3).map((stat) => {
                    const maxStat = 255; 
                    const percentage = (stat.base_stat / maxStat) * 100;
                    
                    return (
                      <div key={stat.pokemon_v2_stat.name} className={cn("text-center",
                        viewMode === 'list' ? 'flex items-center space-x-4 justify-between md:justify-around' : ''
                      )}>
                        <div className="text-gray-500 dark:text-gray-400 mb-1 min-w-6">
                          {stat.pokemon_v2_stat.name === 'hp' ? 'HP' :
                          stat.pokemon_v2_stat.name === 'attack' ? 'ATK' :
                          stat.pokemon_v2_stat.name.slice(0, 3).toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {stat.base_stat}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 hidden md:block">
                          <div
                            className="h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: typeColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Total Stats */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total:</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {pokemon.pokemon_v2_pokemonstats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}