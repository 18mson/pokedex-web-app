export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  pokemon_v2_pokemonstats: Array<{
    base_stat: number;
    pokemon_v2_stat: {
      name: string;
    };
  }>;
  pokemon_v2_pokemontypes: Array<{
    pokemon_v2_type: {
      name: string;
    };
  }>;
  pokemon_v2_pokemonspecy?: {
    pokemon_v2_evolutionchain?: {
      pokemon_v2_pokemonspecies: Array<{
        id: number;
        name: string;
        pokemon_v2_pokemons: Array<{ id: number; name: string }>;
      }>;
    };
    generation_id: number;
    pokemon_v2_pokemonspeciesnames?: Array<{ genus: string }>;
    pokemon_v2_generation?: { name: string };
    pokemon_v2_pokemonspeciesflavortexts?: Array<{ flavor_text: string }>;
  };
  pokemon_v2_pokemonabilities?: Array<{
    pokemon_v2_ability: {
      name: string;
      pokemon_v2_abilitynames?: Array<{ name: string }>;
    };
  }>;
}

export interface DetailPokemon extends Pokemon {
  pokemon_v2_pokemonmoves: {
    pokemon_v2_move: {
      name: string;
      power: number | null;
      accuracy: number | null;
      pokemon_v2_type: {
        name: string;
      };
      pokemon_v2_movenames?: {
        name: string;
      }[];
    };
  }[];
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  pokemon_v2_pokemontypes: Array<{
    pokemon_v2_type: { name: string, id: number };

  }>;
  pokemon_v2_pokemonspecy: {
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: Array<{
        id: number;
        name: string;
        pokemon_v2_pokemons: Array<{ id: number; name: string }>;
      }>;
    };
    generation_id: number;
    pokemon_v2_pokemonspeciesnames?: Array<{ genus: string }>;
    pokemon_v2_generation?: { name: string };
    pokemon_v2_pokemonspeciesflavortexts?: Array<{ flavor_text: string }>;
  };
  pokemon_v2_pokemonstats: Array<{
    base_stat: number;
    pokemon_v2_stat: { name: string };
  }>;
  pokemon_v2_pokemonabilities?: Array<{
    pokemon_v2_ability: {
      name: string;
      pokemon_v2_abilitynames?: Array<{ name: string }>;
    };
  }>;
}

export interface TypeEffectiveness {
  damage_factor: number;
  pokemon_v2_type: { name: string };
  pokemonV2TypeByTargetTypeId: { name: string };
}