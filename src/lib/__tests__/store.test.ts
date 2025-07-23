import { usePokedexStore } from '../store';
import { act } from '@testing-library/react';
import { Pokemon } from '../types';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  pokemon_v2_pokemonstats: [],
  pokemon_v2_pokemontypes: [],
};

describe('usePokedexStore', () => {
  beforeEach(() => {
    act(() => {
      usePokedexStore.setState({
        theme: 'light',
        searchTerm: '',
        selectedTypes: [],
        selectedGeneration: null,
        sortBy: 'id',
        sortOrder: 'asc',
        pageSize: 20,
        currentPage: 1,
        totalCount: 0,
        allPokemon: [],
        filteredPokemon: [],
        comparisonPokemon: [],
        favorites: [],
        viewMode: 'grid',
        isLoading: false,
      });
    });
  });

  it('should have the correct initial state', () => {
    const { getState } = usePokedexStore;
    expect(getState().theme).toBe('light');
    expect(getState().searchTerm).toBe('');
    expect(getState().selectedTypes).toEqual([]);
    expect(getState().selectedGeneration).toBeNull();
    expect(getState().sortBy).toBe('id');
    expect(getState().sortOrder).toBe('asc');
    expect(getState().pageSize).toBe(20);
    expect(getState().currentPage).toBe(1);
    expect(getState().totalCount).toBe(0);
    expect(getState().allPokemon).toEqual([]);
    expect(getState().filteredPokemon).toEqual([]);
    expect(getState().comparisonPokemon).toEqual([]);
    expect(getState().favorites).toEqual([]);
    expect(getState().viewMode).toBe('grid');
    expect(getState().isLoading).toBe(false);
  });

  it('should toggle the theme', () => {
    const { getState } = usePokedexStore;
    
    act(() => {
      getState().toggleTheme();
    });
    expect(getState().theme).toBe('dark');

    act(() => {
      getState().toggleTheme();
    });
    expect(getState().theme).toBe('light');
  });

  it('should set search term', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setSearchTerm('Pikachu');
    });
    expect(getState().searchTerm).toBe('Pikachu');
  });

  it('should set selected types', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setSelectedTypes(['Electric']);
    });
    expect(getState().selectedTypes).toEqual(['Electric']);
  });

  it('should set selected generation', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setSelectedGeneration(1);
    });
    expect(getState().selectedGeneration).toBe(1);
  });

  it('should set sorting', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setSorting('name', 'desc');
    });
    expect(getState().sortBy).toBe('name');
    expect(getState().sortOrder).toBe('desc');
  });

  it('should set page size', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setPageSize(50);
    });
    expect(getState().pageSize).toBe(50);
    expect(getState().currentPage).toBe(1);
  });

  it('should set current page', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setCurrentPage(2);
    });
    expect(getState().currentPage).toBe(2);
  });

  it('should set total count', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setTotalCount(151);
    });
    expect(getState().totalCount).toBe(151);
  });

  it('should set all pokemon', () => {
    const { getState } = usePokedexStore;
    const pokemon = [mockPokemon];
    act(() => {
      getState().setAllPokemon(pokemon);
    });
    expect(getState().allPokemon).toEqual(pokemon);
  });

  it('should set filtered pokemon', () => {
    const { getState } = usePokedexStore;
    const pokemon = [mockPokemon];
    act(() => {
      getState().setFilteredPokemon(pokemon);
    });
    expect(getState().filteredPokemon).toEqual(pokemon);
  });

  it('should add to comparison', () => {
    const { getState } = usePokedexStore;
    const charmander = { ...mockPokemon, id: 4, name: 'Charmander' };
    act(() => {
      getState().addToComparison(mockPokemon);
    });
    expect(getState().comparisonPokemon).toEqual([mockPokemon]);
    act(() => {
      getState().addToComparison(charmander);
    });
    expect(getState().comparisonPokemon).toEqual([mockPokemon, charmander]);
  });

  it('should not add more than 4 pokemon to comparison', () => {
    const { getState } = usePokedexStore;
    const pokemon = [
      { ...mockPokemon, id: 1, name: 'Bulbasaur' },
      { ...mockPokemon, id: 4, name: 'Charmander' },
      { ...mockPokemon, id: 7, name: 'Squirtle' },
      { ...mockPokemon, id: 25, name: 'Pikachu' },
    ];
    act(() => {
      pokemon.forEach((p) => getState().addToComparison(p));
    });
    expect(getState().comparisonPokemon).toEqual(pokemon);
    act(() => {
      getState().addToComparison({ ...mockPokemon, id: 39, name: 'Jigglypuff' });
    });
    expect(getState().comparisonPokemon).toEqual(pokemon);
  });

  it('should not add the same pokemon to comparison twice', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().addToComparison(mockPokemon);
    });
    expect(getState().comparisonPokemon).toEqual([mockPokemon]);
    act(() => {
      getState().addToComparison(mockPokemon);
    });
    expect(getState().comparisonPokemon).toEqual([mockPokemon]);
  });

  it('should remove from comparison', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().addToComparison(mockPokemon);
    });
    expect(getState().comparisonPokemon).toEqual([mockPokemon]);
    act(() => {
      getState().removeFromComparison(1);
    });
    expect(getState().comparisonPokemon).toEqual([]);
  });

  it('should clear comparison', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().addToComparison(mockPokemon);
    });
    expect(getState().comparisonPokemon).toEqual([mockPokemon]);
    act(() => {
      getState().clearComparison();
    });
    expect(getState().comparisonPokemon).toEqual([]);
  });

  it('should toggle favorite', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().toggleFavorite(25);
    });
    expect(getState().favorites).toEqual([25]);
    act(() => {
      getState().toggleFavorite(25);
    });
    expect(getState().favorites).toEqual([]);
  });

  it('should set view mode', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setViewMode('list');
    });
    expect(getState().viewMode).toBe('list');
  });

  it('should set loading state', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setIsLoading(true);
    });
    expect(getState().isLoading).toBe(true);
  });

  it('should clear filters', () => {
    const { getState } = usePokedexStore;
    act(() => {
      getState().setSearchTerm('Pikachu');
      getState().setSelectedTypes(['Electric']);
      getState().setSelectedGeneration(1);
      getState().setSorting('name', 'desc');
      getState().setCurrentPage(2);
    });
    act(() => {
      getState().clearFilters();
    });
    expect(getState().searchTerm).toBe('');
    expect(getState().selectedTypes).toEqual([]);
    expect(getState().selectedGeneration).toBeNull();
    expect(getState().sortBy).toBe('id');
    expect(getState().sortOrder).toBe('asc');
    expect(getState().currentPage).toBe(1);
  });
});