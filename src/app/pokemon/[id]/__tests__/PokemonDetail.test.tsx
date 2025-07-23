import { render, screen, waitFor } from '@testing-library/react';
import { PokemonDetail } from '../PokemonDetail';
import { MockedProvider } from '@apollo/client/testing';
import { GET_TYPE_EFFECTIVENESS } from '@/lib/graphql/queries';
import { DetailPokemon } from '@/lib/types';

const mockPokemon: DetailPokemon = {
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
    { pokemon_v2_type: { name: 'grass', id: 12 } },
    { pokemon_v2_type: { name: 'poison', id: 4 } },
  ],
  pokemon_v2_pokemonspecy: {
    generation_id: 1,
    pokemon_v2_generation: { name: 'generation-i' },
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: [],
    },
  },
  pokemon_v2_pokemonmoves: [],
};

const mocks = [
  {
    request: {
      query: GET_TYPE_EFFECTIVENESS,
      variables: { id: null },
    },
    result: {
      data: {
        pokemon_v2_typeefficacy: [],
      },
    },
  },
  {
    request: {
      query: GET_TYPE_EFFECTIVENESS,
      variables: { id: 12 },
    },
    result: {
      data: {
        pokemon_v2_typeefficacy: [
          {
            damage_factor: 200,
            pokemonV2TypeByTargetTypeId: { name: 'fire' },
          },
        ],
      },
    },
  },
];

describe('PokemonDetail', () => {
  it('renders the pokemon details and type effectiveness', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <PokemonDetail pokemon={mockPokemon} />
      </MockedProvider>
    );

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('Generation-i')).toBeInTheDocument();
    expect(screen.getByText('Base Stats')).toBeInTheDocument();
    expect(screen.getAllByText('Type Effectiveness')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('VS fire')).toBeInTheDocument();
    });
  });
});