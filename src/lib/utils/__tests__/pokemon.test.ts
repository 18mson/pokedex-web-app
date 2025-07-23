import {
  getPokemonImageUrl,
  getPokemonSpriteUrl,
  getTypeColor,
  formatPokemonName,
  formatStat,
  getPokemonStats,
  getPokemonGen,
  getStatTotal,
  sortPokemon,
  filterPokemon,
  getEffectivenessLabel,
} from '../pokemon';
import { Pokemon } from '../../types';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  pokemon_v2_pokemonstats: [
    { base_stat: 45, pokemon_v2_stat: { name: 'hp' } },
    { base_stat: 49, pokemon_v2_stat: { name: 'attack' } },
    { base_stat: 49, pokemon_v2_stat: { name: 'defense' } },
  ],
  pokemon_v2_pokemontypes: [
    { pokemon_v2_type: { name: 'grass' } },
    { pokemon_v2_type: { name: 'poison' } },
  ],
  pokemon_v2_pokemonspecy: {
    generation_id: 1,
    pokemon_v2_generation: { name: 'generation-i' },
  },
};

const mockPokemon2: Pokemon = {
  id: 4,
  name: 'charmander',
  height: 6,
  weight: 85,
  base_experience: 62,
  pokemon_v2_pokemonstats: [
    { base_stat: 39, pokemon_v2_stat: { name: 'hp' } },
    { base_stat: 52, pokemon_v2_stat: { name: 'attack' } },
    { base_stat: 43, pokemon_v2_stat: { name: 'defense' } },
  ],
  pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: 'fire' } }],
  pokemon_v2_pokemonspecy: {
    generation_id: 1,
    pokemon_v2_generation: { name: 'generation-i' },
  },
};

describe('pokemon utils', () => {
  it('getPokemonImageUrl returns the correct url', () => {
    expect(getPokemonImageUrl(1)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    );
  });

  it('getPokemonSpriteUrl returns the correct url', () => {
    expect(getPokemonSpriteUrl(1)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    );
  });

  it('getTypeColor returns the correct color', () => {
    expect(getTypeColor('grass')).toBe('#78C850');
    expect(getTypeColor('fire')).toBe('#F08030');
    expect(getTypeColor('unknown')).toBe('#68A090');
  });

  it('formatPokemonName capitalizes the first letter', () => {
    expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur');
  });

  it('formatStat formats the stat name correctly', () => {
    expect(formatStat('hp')).toBe('HP');
    expect(formatStat('special-attack')).toBe('Sp. Attack');
    expect(formatStat('unknown')).toBe('unknown');
  });

  it('getPokemonStats returns a map of stats', () => {
    const stats = getPokemonStats(mockPokemon);
    expect(stats).toEqual({
      hp: 45,
      attack: 49,
      defense: 49,
    });
  });

  it('getPokemonGen returns the generation name', () => {
    expect(getPokemonGen(mockPokemon)).toBe('generation-i');
  });

  it('getStatTotal returns the sum of all stats', () => {
    expect(getStatTotal(mockPokemon)).toBe(143);
  });

  describe('sortPokemon', () => {
    const pokemonList = [mockPokemon, mockPokemon2];

    it('sorts by id', () => {
      const sorted = sortPokemon(pokemonList, 'id', 'desc');
      expect(sorted[0].id).toBe(4);
    });

    it('sorts by name', () => {
      const sorted = sortPokemon(pokemonList, 'name', 'asc');
      expect(sorted[0].name).toBe('bulbasaur');
    });

    it('sorts by stat', () => {
      const sorted = sortPokemon(pokemonList, 'attack', 'desc');
      expect(sorted[0].name).toBe('charmander');
    });
  });

  describe('filterPokemon', () => {
    const pokemonList = [mockPokemon, mockPokemon2];

    it('filters by search term', () => {
      const filtered = filterPokemon(pokemonList, 'bulb', [], null);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('bulbasaur');
    });

    it('filters by type', () => {
      const filtered = filterPokemon(pokemonList, '', ['fire'], null);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('charmander');
    });

    it('filters by generation', () => {
      const pokemonWithGen2 = {
        ...mockPokemon,
        id: 152,
        name: 'chikorita',
        pokemon_v2_pokemonspecy: {
          ...mockPokemon.pokemon_v2_pokemonspecy,
          generation_id: 2,
        },
      };
      const listWithGen2 = [...pokemonList, pokemonWithGen2];
      const filtered = filterPokemon(listWithGen2, '', [], 1);
      expect(filtered.length).toBe(2);
    });
  });

  it('getEffectivenessLabel returns the correct label', () => {
    expect(getEffectivenessLabel(0)).toBe('Immune');
    expect(getEffectivenessLabel(50)).toBe('Not Very Effective (½×)');
    expect(getEffectivenessLabel(100)).toBe('Normal (1×)');
    expect(getEffectivenessLabel(200)).toBe('Super Effective (2×)');
    expect(getEffectivenessLabel(25)).toBe('0.25× Damage');
  });
});