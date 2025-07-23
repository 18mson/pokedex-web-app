import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonModal } from '../ComparisonModal';
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
  pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: 'grass' } }],
  pokemon_v2_pokemonabilities: [{ pokemon_v2_ability: { name: 'overgrow' } }],
};

describe('ComparisonModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ComparisonModal
        isOpen={false}
        onClose={() => {}}
        comparisonPokemon={[]}
        clearComparison={() => {}}
        removeFromComparison={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal when isOpen is true', () => {
    render(
      <ComparisonModal
        isOpen={true}
        onClose={() => {}}
        comparisonPokemon={[mockPokemon]}
        clearComparison={() => {}}
        removeFromComparison={() => {}}
      />
    );
    expect(screen.getByText('Pokemon Comparison (1/4)')).toBeInTheDocument();
    expect(screen.getAllByText('Bulbasaur')[0]).toBeInTheDocument();
    expect(screen.getByText('Base Stats Comparison')).toBeInTheDocument();
    expect(screen.getByText('Abilities Comparison')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <ComparisonModal
        isOpen={true}
        onClose={onClose}
        comparisonPokemon={[mockPokemon]}
        clearComparison={() => {}}
        removeFromComparison={() => {}}
      />
    );
    const closeButton = screen.getByLabelText('Close comparison modal');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls clearComparison when the clear all button is clicked', () => {
    const clearComparison = jest.fn();
    render(
      <ComparisonModal
        isOpen={true}
        onClose={() => {}}
        comparisonPokemon={[mockPokemon]}
        clearComparison={clearComparison}
        removeFromComparison={() => {}}
      />
    );
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    expect(clearComparison).toHaveBeenCalled();
  });
});