'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePokedexStore } from '@/lib/store';
import { 
  getTypeColor, 
  formatPokemonName,
  getEffectivenessLabel, 
} from '@/lib/utils/pokemon';
import EvolutionChain from '@/components/evolutionChain/EvolutionChain';
import { DetailPokemon, TypeEffectiveness } from '@/lib/types';
import { Stats } from '@/components/stats/Stats';
import { Abilities } from '@/components/abilities/Abilities';
import { CardDetail } from '@/components/cardDetail/CardDetail';
import { useQuery } from '@apollo/client';
import { GET_TYPE_EFFECTIVENESS } from '@/lib/graphql/queries';
import { useEffect, useState } from 'react';


interface PokemonDetailProps {
  pokemon: DetailPokemon;
}

export function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const {
    favorites,
    toggleFavorite,
    comparisonPokemon,
    addToComparison,
    removeFromComparison,
  } = usePokedexStore();

  const { data, loading } = useQuery(GET_TYPE_EFFECTIVENESS, {

    variables: {
      id: selectedType,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  const typeEfficacy = data?.pokemon_v2_typeefficacy || [];
  
useEffect(() => {
  setSelectedType(pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.id);
}, [pokemon]);

  const isFavorite = favorites.includes(pokemon.id);
  const isInComparison = comparisonPokemon.some(p => p.id === pokemon.id);
  const canAddToComparison = comparisonPokemon.length < 4;

  const primaryType = pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name;
  const typeColor = primaryType ? getTypeColor(primaryType) : '#68A090';

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

  const renderLoadingTypes = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Type Effectiveness
      </h3>
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex justify-between animate-pulse">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

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
      {/* card detail pokemon */}
      {<CardDetail
        pokemon={pokemon}
        typeColor={typeColor}
        isFavorite={isFavorite}
        isInComparison={isInComparison}
        canAddToComparison={canAddToComparison}
        onToggleFavorite={handleToggleFavorite}
        onToggleComparison={handleToggleComparison}
      />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* generation */}
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
          {/* stats */}
          {<Stats
            pokemon={pokemon}
            typeColor={typeColor}
          />}
          {/* evolution chain */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <EvolutionChain
              species={pokemon.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies}
              currentPokemonName={pokemon.name}
            />
          </div>
          {/* description */}
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
          {/* abilities */}
          {(pokemon.pokemon_v2_pokemonabilities && pokemon.pokemon_v2_pokemonabilities.length > 0) && (
            <Abilities
              pokemon={{
                ...pokemon,
                pokemon_v2_pokemonabilities: pokemon.pokemon_v2_pokemonabilities || []
              }}
            />
          )}
        </div>
        {/* type effectiveness */}
        <div className="space-y-6">
          
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Type Effectiveness
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {pokemon.pokemon_v2_pokemontypes.map((type) => (
                  <button
                    key={type.pokemon_v2_type.id}
                    onClick={() => {
                      setSelectedType(type.pokemon_v2_type.id);
                    }}
                    className={`px-4 py-2 rounded-full text-white font-medium transition-colors cursor-pointer ${
                      type.pokemon_v2_type.id === selectedType
                        ? 'opacity-100'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{
                      backgroundColor: getTypeColor(type.pokemon_v2_type.name)
                    }}
                  >
                    {type.pokemon_v2_type.name}
                  </button>
                ))}
              </div>
                { loading ? (
                  renderLoadingTypes()
                    ) : (<div className="">
                    {typeEfficacy?.length > 0 && typeEfficacy.map((item: TypeEffectiveness, index: number) => (
                      <div className="flex justify-between" key={index}>
                        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize" style={{
                          color: getTypeColor(item.pokemonV2TypeByTargetTypeId?.name),
                        }}>
                          VS {item.pokemonV2TypeByTargetTypeId?.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 font-bold" >{getEffectivenessLabel(item.damage_factor)}</p>
                      </div>
                    ))}
                </div>)}
            </div>
          
          {/* moves */}
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
    </div>
  );
}