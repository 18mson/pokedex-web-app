'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

type EvolutionSpecies = {
  id: number;
  name: string;
  pokemon_v2_pokemons: { id: number }[];
};

type Props = {
  species: EvolutionSpecies[];
  currentPokemonName: string;
};

export default function EvolutionChain({ species, currentPokemonName }: Props) {
  const sorted = [...species].sort((a, b) => a.id - b.id);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Evolution Chain</h2>
      <div className="flex flex-wrap items-center gap-4">
        {sorted.map((s, index) => {
          const imgId = s.pokemon_v2_pokemons[0]?.id;
          const isCurrent = s.name === currentPokemonName;

          return (
            <div key={s.id} className="flex items-center gap-4">
              <div className="text-center">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${imgId}.png`}
                  alt={s.name}
                  width={80}
                  height={80}
                  className={`mx-auto ${isCurrent ? 'scale-110 drop-shadow-md' : ''}`}
                />
                <p className={`capitalize text-sm mt-1 text-gray-600 dark:text-gray-400 ${isCurrent ? 'font-semibold' : ''}`}>
                  {s.name}
                </p>
              </div>
              {index !== sorted.length - 1 && <ArrowRight className="text-gray-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
