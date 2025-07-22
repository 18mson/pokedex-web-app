import { BarChart3 } from "lucide-react";

interface StatsProps {
  pokemon: {
    pokemon_v2_pokemonstats: Array<{
      base_stat: number;
      pokemon_v2_stat: {
        name: string;
      };
    }>;
  };
  typeColor: string;
}

const formatStat = (statName: string): string => {
  return statName
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const Stats = ({ pokemon, typeColor }: StatsProps) => {
  const totalStats = pokemon.pokemon_v2_pokemonstats.reduce(
    (sum, stat) => sum + stat.base_stat,
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Base Stats
        </h2>
      </div>

      <div className="space-y-4">
        {pokemon.pokemon_v2_pokemonstats.map((stat) => {
          const percentage = (stat.base_stat / 255) * 100;
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
  );
};
