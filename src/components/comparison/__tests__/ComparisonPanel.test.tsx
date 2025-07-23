import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonPanel } from '../ComparisonPanel';
import { usePokedexStore } from '@/lib/store';
import { Pokemon } from '@/lib/types';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  pokemon_v2_pokemonstats: [],
  pokemon_v2_pokemontypes: [],
};

describe('ComparisonPanel', () => {
  it('renders nothing when no pokemon are in comparison', () => {
    usePokedexStore.setState({ comparisonPokemon: [] });
    const { container } = render(<ComparisonPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the panel when pokemon are in comparison', () => {
    usePokedexStore.setState({ comparisonPokemon: [mockPokemon] });
    render(<ComparisonPanel />);
    expect(screen.getByText('Pokemon Comparison (1/4)')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('clears the comparison when the clear button is clicked', () => {
    const clearComparison = jest.fn();
    usePokedexStore.setState({
      comparisonPokemon: [mockPokemon],
      clearComparison,
    });
    render(<ComparisonPanel />);
    const clearButton = screen.getByTitle('Clear comparison');
    fireEvent.click(clearButton);
    expect(clearComparison).toHaveBeenCalled();
  });

  it('opens the modal when the expand button is clicked', () => {
    usePokedexStore.setState({ comparisonPokemon: [mockPokemon] });
    render(<ComparisonPanel />);
    const expandButton = screen.getByTitle('Expand comparison');
    fireEvent.click(expandButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});