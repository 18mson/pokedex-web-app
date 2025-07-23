import { render, screen, fireEvent } from '@testing-library/react';
import { CardDetail } from '../CardDetail';

const mockPokemon = {
  id: 1,
  name: 'Bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  pokemon_v2_pokemontypes: [
    { pokemon_v2_type: { name: 'grass' } },
    { pokemon_v2_type: { name: 'poison' } },
  ],
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesnames: [{ genus: 'Seed Pokémon' }],
  },
};

describe('CardDetail', () => {
  it('renders the pokemon details correctly', () => {
    render(
      <CardDetail
        pokemon={mockPokemon}
        isFavorite={false}
        isInComparison={false}
        canAddToComparison={true}
        onToggleFavorite={() => {}}
        onToggleComparison={() => {}}
        typeColor="#78C850"
      />
    );
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Poison')).toBeInTheDocument();
    expect(screen.getByText('0.7m')).toBeInTheDocument();
    expect(screen.getByText('6.9kg')).toBeInTheDocument();
    expect(screen.getByText('64')).toBeInTheDocument();
  });

  it('calls onToggleFavorite when the favorite button is clicked', () => {
    const onToggleFavorite = jest.fn();
    render(
      <CardDetail
        pokemon={mockPokemon}
        isFavorite={false}
        isInComparison={false}
        canAddToComparison={true}
        onToggleFavorite={onToggleFavorite}
        onToggleComparison={() => {}}
        typeColor="#78C850"
      />
    );
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    expect(onToggleFavorite).toHaveBeenCalled();
  });

  it('calls onToggleComparison when the comparison button is clicked', () => {
    const onToggleComparison = jest.fn();
    render(
      <CardDetail
        pokemon={mockPokemon}
        isFavorite={false}
        isInComparison={false}
        canAddToComparison={true}
        onToggleFavorite={() => {}}
        onToggleComparison={onToggleComparison}
        typeColor="#78C850"
      />
    );
    const comparisonButton = screen.getByLabelText('Add to comparison');
    fireEvent.click(comparisonButton);
    expect(onToggleComparison).toHaveBeenCalled();
  });
});