import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Grid } from '../Grid';
import { MockedProvider } from '@apollo/client/testing';
import { GET_POKEMON_LIST, GET_POKEMON_COUNT } from '@/lib/graphql/queries';
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

const mocks = [
  {
    request: {
      query: GET_POKEMON_COUNT,
      variables: { where: undefined },
    },
    result: {
      data: {
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: 1,
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_POKEMON_LIST,
      variables: {
        limit: 20,
        offset: 0,
        where: undefined,
        order_by: [{ id: 'asc' }],
      },
    },
    result: {
      data: {
        pokemon_v2_pokemon: [mockPokemon],
      },
    },
  },
];

describe('Grid', () => {
  it('renders the grid with pokemon cards', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Grid />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('renders the loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Grid />
      </MockedProvider>
    );
    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(12);
  });

  it('renders the error state', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_POKEMON_COUNT,
          variables: { where: undefined },
        },
        error: new Error('An error occurred'),
      },
      {
        request: {
          query: GET_POKEMON_LIST,
          variables: {
            limit: 20,
            offset: 0,
            where: undefined,
            order_by: [{ id: 'asc' }],
          },
        },
        error: new Error('An error occurred'),
      },
    ];
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Grid />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Error loading Pokemon')).toBeInTheDocument();
    });
  });

  it('renders the empty state', async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_POKEMON_COUNT,
          variables: { where: undefined },
        },
        result: {
          data: {
            pokemon_v2_pokemon_aggregate: {
              aggregate: {
                count: 0,
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_POKEMON_LIST,
          variables: {
            limit: 20,
            offset: 0,
            where: undefined,
            order_by: [{ id: 'asc' }],
          },
        },
        result: {
          data: {
            pokemon_v2_pokemon: [],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <Grid />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('No Pokemon found')).toBeInTheDocument();
    });
  });

  it('changes the page when a page number is clicked', async () => {
    const mocksWithPagination = [
      {
        request: {
          query: GET_POKEMON_COUNT,
          variables: { where: undefined },
        },
        result: {
          data: {
            pokemon_v2_pokemon_aggregate: {
              aggregate: {
                count: 50,
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_POKEMON_LIST,
          variables: {
            limit: 20,
            offset: 0,
            where: undefined,
            order_by: [{ id: 'asc' }],
          },
        },
        result: {
          data: {
            pokemon_v2_pokemon: [mockPokemon],
          },
        },
      },
      {
        request: {
          query: GET_POKEMON_LIST,
          variables: {
            limit: 20,
            offset: 20,
            where: undefined,
            order_by: [{ id: 'asc' }],
          },
        },
        result: {
          data: {
            pokemon_v2_pokemon: [{ ...mockPokemon, id: 21, name: 'Spearow' }],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocksWithPagination} addTypename={false}>
        <Grid />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    await waitFor(() => {
      expect(screen.getByText('Spearow')).toBeInTheDocument();
    });
  });

});