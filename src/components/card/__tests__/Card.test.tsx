import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonCard } from '../Card';
import { usePokedexStore } from '@/lib/store';
import { Pokemon } from '@/lib/types';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
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
};

describe('PokemonCard', () => {
  it('renders the pokemon card correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} viewMode="grid" />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Poison')).toBeInTheDocument();
  });

  it('toggles favorite when the heart button is clicked', () => {
    const toggleFavorite = jest.fn();
    usePokedexStore.setState({ toggleFavorite });
    render(<PokemonCard pokemon={mockPokemon} viewMode="grid" />);
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    expect(toggleFavorite).toHaveBeenCalledWith(1);
  });

  it('adds to comparison when the plus button is clicked', () => {
    const addToComparison = jest.fn();
    usePokedexStore.setState({ addToComparison, comparisonPokemon: [] });
    render(<PokemonCard pokemon={mockPokemon} viewMode="grid" />);
    const comparisonButton = screen.getByLabelText('Add to comparison');
    fireEvent.click(comparisonButton);
    expect(addToComparison).toHaveBeenCalledWith(mockPokemon);
  });

  it('removes from comparison when the minus button is clicked', () => {
    const removeFromComparison = jest.fn();
    usePokedexStore.setState({
      removeFromComparison,
      comparisonPokemon: [mockPokemon],
    });
    render(<PokemonCard pokemon={mockPokemon} viewMode="grid" />);
    const comparisonButton = screen.getByLabelText('Remove from comparison');
    fireEvent.click(comparisonButton);
    expect(removeFromComparison).toHaveBeenCalledWith(1);
  });
});