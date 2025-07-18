import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  pokemon_v2_pokemonstats: Array<{
    base_stat: number;
    pokemon_v2_stat: {
      name: string;
    };
  }>;
  pokemon_v2_pokemontypes: Array<{
    pokemon_v2_type: {
      name: string;
    };
  }>;
  pokemon_v2_pokemonspecy: {
    generation_id: number;
    pokemon_v2_generation: {
      name: string;
    };
  };
}

interface PokedexState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedGeneration: number | null;
  setSelectedGeneration: (gen: number | null) => void;
  sortBy: 'id' | 'name' | 'height' | 'weight';
  sortOrder: 'asc' | 'desc';
  setSorting: (by: 'id' | 'name' | 'height' | 'weight', order: 'asc' | 'desc') => void;
  
  allPokemon: Pokemon[];
  setAllPokemon: (pokemon: Pokemon[]) => void;
  filteredPokemon: Pokemon[];
  setFilteredPokemon: (pokemon: Pokemon[]) => void;
  
  comparisonPokemon: Pokemon[];
  addToComparison: (pokemon: Pokemon) => void;
  removeFromComparison: (pokemonId: number) => void;
  clearComparison: () => void;
  
  favorites: number[];
  toggleFavorite: (pokemonId: number) => void;
  
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  clearFilters: () => void;
}

export const usePokedexStore = create<PokedexState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
      selectedTypes: [],
      setSelectedTypes: (types) => set({ selectedTypes: types }),
      selectedGeneration: null,
      setSelectedGeneration: (gen) => set({ selectedGeneration: gen }),
      sortBy: 'id',
      sortOrder: 'asc',
      setSorting: (by, order) => set({ sortBy: by, sortOrder: order }),
      
      allPokemon: [],
      setAllPokemon: (pokemon) => set({ allPokemon: pokemon }),
      filteredPokemon: [],
      setFilteredPokemon: (pokemon) => set({ filteredPokemon: pokemon }),
      
      comparisonPokemon: [],
      addToComparison: (pokemon) => {
        const current = get().comparisonPokemon;
        if (current.length < 4 && !current.find(p => p.id === pokemon.id)) {
          set({ comparisonPokemon: [...current, pokemon] });
        }
      },
      removeFromComparison: (pokemonId) => {
        set((state) => ({
          comparisonPokemon: state.comparisonPokemon.filter(p => p.id !== pokemonId)
        }));
      },
      clearComparison: () => set({ comparisonPokemon: [] }),
      
      favorites: [],
      toggleFavorite: (pokemonId) => {
        set((state) => {
          const isFavorite = state.favorites.includes(pokemonId);
          return {
            favorites: isFavorite
              ? state.favorites.filter(id => id !== pokemonId)
              : [...state.favorites, pokemonId]
          };
        });
      },
      
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      clearFilters: () => set({
        searchTerm: '',
        selectedTypes: [],
        selectedGeneration: null,
        sortBy: 'id',
        sortOrder: 'asc'
      }),
    }),
    {
      name: 'pokedex-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);