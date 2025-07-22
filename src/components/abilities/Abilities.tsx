import { formatPokemonName } from '@/lib/utils/pokemon';

interface AbilityName {
  name: string;
}

interface Ability {
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilitynames?: AbilityName[];
  };
}

interface PokemonData {
  pokemon_v2_pokemonabilities: Ability[];
}

interface AbilitiesProps {
  pokemon: PokemonData;
}

export const Abilities = ({ pokemon }: AbilitiesProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Abilities
      </h3>
      <div className="space-y-2">
        {pokemon.pokemon_v2_pokemonabilities.map(
          (abilityInfo: Ability, index: number) => (
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
  );
};
