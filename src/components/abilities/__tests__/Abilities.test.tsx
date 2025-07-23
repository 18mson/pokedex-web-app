import { render, screen } from '@testing-library/react';
import { Abilities } from '../Abilities';

const mockPokemon = {
  pokemon_v2_pokemonabilities: [
    {
      pokemon_v2_ability: {
        name: 'overgrow',
        pokemon_v2_abilitynames: [{ name: 'Overgrow' }],
      },
    },
    {
      pokemon_v2_ability: {
        name: 'chlorophyll',
        pokemon_v2_abilitynames: [{ name: 'Chlorophyll' }],
      },
    },
  ],
};

describe('Abilities', () => {
  it('renders the abilities correctly', () => {
    render(<Abilities pokemon={mockPokemon} />);
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Overgrow')).toBeInTheDocument();
    expect(screen.getByText('Chlorophyll')).toBeInTheDocument();
  });
});