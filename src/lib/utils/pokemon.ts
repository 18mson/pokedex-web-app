import { Pokemon } from '../store';

export const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const getPokemonSpriteUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

export const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type] || '#68A090';
};

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatStat = (statName: string): string => {
  const statMap: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    'speed': 'Speed',
  };
  return statMap[statName] || statName;
};

export const getPokemonStats = (pokemon: Pokemon) => {
  return pokemon.pokemon_v2_pokemonstats.reduce((acc, stat) => {
    acc[stat.pokemon_v2_stat.name] = stat.base_stat;
    return acc;
  }, {} as Record<string, number>);
};

export const getStatTotal = (pokemon: Pokemon): number => {
  return pokemon.pokemon_v2_pokemonstats.reduce((total, stat) => total + stat.base_stat, 0);
};

export const sortPokemon = (
  pokemon: Pokemon[],
  sortBy: 'id' | 'name' | 'height' | 'weight',
  order: 'asc' | 'desc'
): Pokemon[] => {
  return [...pokemon].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'height':
        aValue = a.height;
        bValue = b.height;
        break;
      case 'weight':
        aValue = a.weight;
        bValue = b.weight;
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return order === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });
};

export const filterPokemon = (
  pokemon: Pokemon[],
  searchTerm: string,
  selectedTypes: string[],
  selectedGeneration: number | null
): Pokemon[] => {
  return pokemon.filter((p) => {
    // Search filter
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Type filter
    if (selectedTypes.length > 0) {
      const pokemonTypes = p.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name);
      if (!selectedTypes.some(type => pokemonTypes.includes(type))) {
        return false;
      }
    }

    // Generation filter
    if (selectedGeneration && p.pokemon_v2_pokemonspecy.generation_id !== selectedGeneration) {
      return false;
    }

    return true;
  });
};