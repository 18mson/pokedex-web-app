'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Plus, Minus, BarChart3 } from 'lucide-react';
import { usePokedexStore } from '@/lib/store';
import { 
  getPokemonImageUrl, 
  getTypeColor, 
  formatPokemonName, 
  formatStat,
  getStatTotal 
} from '@/lib/utils/pokemon';
import EvolutionChain from '@/components/evolutionChain/EvolutionChain';
import { cn } from '@/lib/utils';
import { DetailPokemon } from '@/lib/types';


interface PokemonDetailProps {
  pokemon: DetailPokemon;
}

export function PokemonDetail({ pokemon }: PokemonDetailProps) {
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

  const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name;
  const typeColor = primaryType ? getTypeColor(primaryType) : '#68A090';


  const totalStats = getStatTotal({
    ...pokemon,
    pokemon_v2_pokemonspecy: pokemon.pokemon_v2_pokemonspecy
      ? {
          generation_id: 0,
          pokemon_v2_generation: pokemon.pokemon_v2_pokemonspecy.pokemon_v2_generation || { name: '' },
        }
      : {
          generation_id: 0,
          pokemon_v2_generation: { name: '' },
        },
  });
  const maxStatValue = Math.max(255, ...pokemon.pokemon_v2_pokemonstats.map((s: { base_stat: number; pokemon_v2_stat: { name: string } }) => s.base_stat));

  const handleToggleFavorite = () => {
    toggleFavorite(pokemon.id);
  };

  const handleToggleComparison = () => {
    if (isInComparison) {
      removeFromComparison(pokemon.id);
    } else if (canAddToComparison) {
      addToComparison({
        ...pokemon,
        pokemon_v2_pokemonspecy: pokemon.pokemon_v2_pokemonspecy
          ? {
              generation_id: 0,
              pokemon_v2_generation: pokemon.pokemon_v2_pokemonspecy.pokemon_v2_generation!,
            }
          : {
              generation_id: 0,
              pokemon_v2_generation: { name: '' },
            },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pokédex
        </Link>
      </div>

      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
        style={{
          background: `linear-gradient(135deg, ${typeColor}20 0%, transparent 50%)`,
        }}
      >
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-64 h-64 relative">
                <Image
                  src={getPokemonImageUrl(pokemon.id)}
                  alt={formatPokemonName(pokemon.name)}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="text-2xl font-mono text-gray-500 dark:text-gray-400">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-200',
                      'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm',
                      'hover:bg-white dark:hover:bg-gray-700',
                      isFavorite ? 'text-red-500' : 'text-gray-400'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
                  </button>
                  <button
                    onClick={handleToggleComparison}
                    disabled={!isInComparison && !canAddToComparison}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-200',
                      'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm',
                      'hover:bg-white dark:hover:bg-gray-700',
                      isInComparison ? 'text-blue-500' : 'text-gray-400',
                      !isInComparison && !canAddToComparison && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isInComparison ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {formatPokemonName(pokemon.name)}
              </h1>

              {pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames?.[0] && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {pokemon.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0].genus}
                </p>
              )}

              <div className="flex gap-3 justify-center md:justify-start mb-6">
                {pokemon.pokemon_v2_pokemontypes.map((typeInfo: { pokemon_v2_type: { name: string } }) => (
                  <span
                    key={typeInfo.pokemon_v2_type.name}
                    className="px-4 py-2 rounded-full text-white font-semibold text-lg"
                    style={{ backgroundColor: getTypeColor(typeInfo.pokemon_v2_type.name) }}
                  >
                    {formatPokemonName(typeInfo.pokemon_v2_type.name)}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(pokemon.height / 10).toFixed(1)}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Height</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pokemon.base_experience || '—'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Base Exp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Base Stats
            </h2>
          </div>

          <div className="space-y-4">
            {pokemon.pokemon_v2_pokemonstats.map((stat: {
              base_stat: number;
              pokemon_v2_stat: { name: string };
            }) => {
              const percentage = (stat.base_stat / maxStatValue) * 100;
              return (
                <div key={stat.pokemon_v2_stat.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {formatStat(stat.pokemon_v2_stat.name)}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {stat.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {totalStats}
                </span>
              </div>
            </div>
          </div>
        </div>
        {(pokemon.pokemon_v2_pokemonabilities && pokemon.pokemon_v2_pokemonabilities.length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Abilities
            </h3>
            <div className="space-y-2">
              {pokemon.pokemon_v2_pokemonabilities.map(
                (
                  abilityInfo: {
                    pokemon_v2_ability: {
                      name: string;
                      pokemon_v2_abilitynames?: { name: string }[];
                    };
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {abilityInfo.pokemon_v2_ability.pokemon_v2_abilitynames?.[0]?.name ||
                        formatPokemonName(abilityInfo.pokemon_v2_ability.name)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Generation
            </h3>
            <div className="text-gray-600 dark:text-gray-400">
              {pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_generation?.name &&
                formatPokemonName(pokemon.pokemon_v2_pokemonspecy.pokemon_v2_generation.name)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <EvolutionChain
              species={pokemon.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies}
              currentPokemonName={pokemon.name}
            />
          </div>

          {pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts?.[0] && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {pokemon.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesflavortexts[0].flavor_text}
              </p>
            </div>
          )}
        </div>

        {pokemon.pokemon_v2_pokemonmoves?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Moves
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pokemon.pokemon_v2_pokemonmoves.slice(0, 10).map((moveData, index) => {
                const move = moveData.pokemon_v2_move;
                const moveName = move.pokemon_v2_movenames?.[0]?.name ?? move.name;

                return (
                  <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-md font-semibold text-gray-800 dark:text-white">{moveName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type: {move.pokemon_v2_type.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Power: {move.power ?? '—'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy: {move.accuracy ?? '—'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
         
      </div>
    </div>
  );
}