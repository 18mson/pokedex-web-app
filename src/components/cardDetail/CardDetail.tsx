import { Heart, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPokemonName, getTypeColor, getPokemonImageUrl } from '@/lib/utils/pokemon';

interface CardDetailProps {
  pokemon: {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    pokemon_v2_pokemontypes: Array<{
      pokemon_v2_type: {
        name: string;
      };
    }>;
    pokemon_v2_pokemonspecy?: {
      pokemon_v2_pokemonspeciesnames?: Array<{
        genus: string;
      }>;
    };
  };
  isFavorite: boolean;
  isInComparison: boolean;
  canAddToComparison: boolean;
  onToggleFavorite: () => void;
  onToggleComparison: () => void;
  typeColor: string;
}

export const CardDetail = ({
  pokemon,
  isFavorite,
  isInComparison,
  canAddToComparison,
  onToggleFavorite,
  onToggleComparison,
  typeColor
}: CardDetailProps) => {
  const handleToggleFavorite = () => {
    onToggleFavorite();
  };

  const handleToggleComparison = () => {
    onToggleComparison();
  };

  return (
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
                className="object-contain rounded-full"
                loading="lazy"
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
  );
};
