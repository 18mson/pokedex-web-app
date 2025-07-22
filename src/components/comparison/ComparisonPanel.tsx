'use client';

import { useState } from 'react';
import { X, BarChart3, Eye, EyeOff, Maximize2, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';
import { usePokedexStore } from '@/lib/store';
import { getPokemonImageUrl, getTypeColor, formatPokemonName, formatStat, getPokemonStats } from '@/lib/utils/pokemon';
import { cn } from '@/lib/utils';
import { Pokemon } from '@/lib/types';

export function ComparisonPanel() {
  const { comparisonPokemon, removeFromComparison, clearComparison } = usePokedexStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (comparisonPokemon.length === 0) {
    return null;
  }

  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  
  // Calculate stat comparisons
  const getStatComparison = (statName: string) => {
    const statValues = comparisonPokemon.map(pokemon => {
      const stats = getPokemonStats(pokemon);
      return { pokemon, value: stats[statName] || 0 };
    });
    
    const maxValue = Math.max(...statValues.map(s => s.value));
    const minValue = Math.min(...statValues.map(s => s.value));
    
    return statValues.map(stat => ({
      ...stat,
      isHighest: stat.value === maxValue && maxValue > minValue,
      isLowest: stat.value === minValue && maxValue > minValue,
      percentage: maxValue > 0 ? (stat.value / maxValue) * 100 : 0
    }));
  };

  const getTotalStats = (pokemon: Pokemon) => {
    const stats = getPokemonStats(pokemon);
    return Object.values(stats).reduce((sum: number, value: number) => sum + (value || 0), 0);
  };

  return (
    <>
      {/* Expanded Modal View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pokemon Comparison ({comparisonPokemon.length}/4)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearComparison}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {/* Pokemon Headers */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {comparisonPokemon.map((pokemon) => {
                  const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name;
                  const typeColor = primaryType ? getTypeColor(primaryType) : '#68A090';
                  const totalStats = getTotalStats(pokemon);

                  return (
                    <div
                      key={pokemon.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 relative"
                      style={{
                        background: `linear-gradient(135deg, ${typeColor}15 0%, transparent 50%)`,
                      }}
                    >
                      <button
                        onClick={() => removeFromComparison(pokemon.id)}
                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <Image
                            src={getPokemonImageUrl(pokemon.id)}
                            alt={formatPokemonName(pokemon.name)}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {formatPokemonName(pokemon.name)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          #{pokemon.id.toString().padStart(3, '0')}
                        </p>

                        {/* Types */}
                        <div className="flex gap-2 justify-center mb-4">
                          {pokemon.pokemon_v2_pokemontypes.map((typeInfo) => (
                            <span
                              key={typeInfo.pokemon_v2_type.name}
                              className="px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: getTypeColor(typeInfo.pokemon_v2_type.name) }}
                            >
                              {formatPokemonName(typeInfo.pokemon_v2_type.name)}
                            </span>
                          ))}
                        </div>

                        {/* Basic Stats */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Height:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(pokemon.height / 10).toFixed(1)}m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(pokemon.weight / 10).toFixed(1)}kg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Total Stats:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {totalStats}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Stats Comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Base Stats Comparison
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-6">
                    {statNames.map((statName) => {
                      const statComparison = getStatComparison(statName);
                      // const maxValue = Math.max(...statComparison.map(s => s.value));

                      return (
                        <div key={statName} className="space-y-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {formatStat(statName)}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {statComparison.map(({ pokemon, value, isHighest, isLowest, percentage }) => {
                              const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name;
                              const typeColor = primaryType ? getTypeColor(primaryType) : '#68A090';

                              return (
                                <div key={pokemon.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatPokemonName(pokemon.name)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <span className={cn(
                                        "font-bold text-sm",
                                        isHighest && "text-green-600 dark:text-green-400",
                                        isLowest && "text-red-600 dark:text-red-400",
                                        !isHighest && !isLowest && "text-gray-900 dark:text-white"
                                      )}>
                                        {value}
                                      </span>
                                      {isHighest && <Award className="w-3 h-3 text-green-600 dark:text-green-400" />}
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                                    <div
                                      className="h-3 rounded-full transition-all duration-500"
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Panel */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 shadow-2xl',
          'transition-all duration-300 ease-in-out',
          isMinimized ? 'translate-y-[calc(100%-3rem)]' : 'translate-y-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pokemon Comparison ({comparisonPokemon.length}/4)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Expand comparison"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {isMinimized ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={clearComparison}
              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={cn('overflow-hidden transition-all duration-300', isMinimized ? 'h-0' : 'h-96')}>
          <div className="p-4 h-full overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
              {comparisonPokemon.map((pokemon) => {
                const stats = getPokemonStats(pokemon);
                const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name;
                const typeColor = primaryType ? getTypeColor(primaryType) : '#68A090';

                return (
                  <div
                    key={pokemon.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative"
                    style={{
                      background: `linear-gradient(135deg, ${typeColor}10 0%, transparent 50%)`,
                    }}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromComparison(pokemon.id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Pokemon Header */}
                    <div className="text-center mb-4">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <Image
                          src={getPokemonImageUrl(pokemon.id)}
                          alt={formatPokemonName(pokemon.name)}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {formatPokemonName(pokemon.name)}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        #{pokemon.id.toString().padStart(3, '0')}
                      </p>
                    </div>

                    {/* Types */}
                    <div className="flex gap-1 justify-center mb-4">
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

                    {/* Stats */}
                    <div className="space-y-2">
                      {statNames.map((statName) => {
                        const statValue = stats[statName] || 0;
                        const maxStat = Math.max(...comparisonPokemon.map(p => getPokemonStats(p)[statName] || 0));
                        const percentage = maxStat > 0 ? (statValue / maxStat) * 100 : 0;
                        const isHighest = statValue === maxStat && maxStat > 0;

                        return (
                          <div key={statName} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {formatStat(statName)}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className={cn(
                                  "font-medium",
                                  isHighest ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                                )}>
                                  {statValue}
                                </span>
                                {isHighest && <Award className="w-3 h-3 text-green-600 dark:text-green-400" />}
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
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

                    {/* Basic Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Height:</span>
                          <span className="text-gray-900 dark:text-white">
                            {(pokemon.height / 10).toFixed(1)}m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                          <span className="text-gray-900 dark:text-white">
                            {(pokemon.weight / 10).toFixed(1)}kg
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}