import { render, screen } from '@testing-library/react';
import { Stats } from '../Stats';

const mockPokemon = {
  pokemon_v2_pokemonstats: [
    { base_stat: 45, pokemon_v2_stat: { name: 'hp' } },
    { base_stat: 49, pokemon_v2_stat: { name: 'attack' } },
    { base_stat: 49, pokemon_v2_stat: { name: 'defense' } },
    { base_stat: 65, pokemon_v2_stat: { name: 'special-attack' } },
    { base_stat: 65, pokemon_v2_stat: { name: 'special-defense' } },
    { base_stat: 45, pokemon_v2_stat: { name: 'speed' } },
  ],
};

describe('Stats', () => {
  it('renders the stats correctly', () => {
    render(<Stats pokemon={mockPokemon} typeColor="#78C850" />);
    expect(screen.getByText('Base Stats')).toBeInTheDocument();
    expect(screen.getByText('Hp')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
    expect(screen.getByText('Special Attack')).toBeInTheDocument();
    expect(screen.getByText('Special Defense')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('318')).toBeInTheDocument(); 
  });
});