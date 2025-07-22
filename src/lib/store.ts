import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pokemon } from './types';



interface PokedexState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Search & Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedGeneration: number | null;
  setSelectedGeneration: (gen: number | null) => void;
  sortBy: 'id' | 'name' | 'height' | 'weight' | 'basebase_stat';
  sortOrder: 'asc' | 'desc';
  setSorting: (by: 'id' | 'name' | 'height' | 'weight' | 'basebase_stat', order: 'asc' | 'desc') => void;
  
  // Pagination
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalCount: number;
  setTotalCount: (count: number) => void;
  
  // Pokemon data
  allPokemon: Pokemon[];
  setAllPokemon: (pokemon: Pokemon[]) => void;
  filteredPokemon: Pokemon[];
  setFilteredPokemon: (pokemon: Pokemon[]) => void;
  
  // Comparison
  comparisonPokemon: Pokemon[];
  addToComparison: (pokemon: Pokemon) => void;
  removeFromComparison: (pokemonId: number) => void;
  clearComparison: () => void;
  
  // Favorites
  favorites: number[];
  toggleFavorite: (pokemonId: number) => void;
  
  // UI State
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Clear all filters
  clearFilters: () => void;
}

export const usePokedexStore = create<PokedexState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // Search & Filters
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
      selectedTypes: [],
      setSelectedTypes: (types) => set({ selectedTypes: types }),
      selectedGeneration: null,
      setSelectedGeneration: (gen) => set({ selectedGeneration: gen }),
      sortBy: 'id',
      sortOrder: 'asc',
      setSorting: (by, order) => set({ sortBy: by, sortOrder: order }),
      
      // Pagination
      pageSize: 20,
      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),
      totalCount: 0,
      setTotalCount: (count) => set({ totalCount: count }),
      
      // Pokemon data
      allPokemon: [],
      setAllPokemon: (pokemon) => set({ allPokemon: pokemon }),
      filteredPokemon: [],
      setFilteredPokemon: (pokemon) => set({ filteredPokemon: pokemon }),
      
      // Comparison
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
      
      // Favorites
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
      
      // UI State
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Clear all filters
      clearFilters: () => set({
        searchTerm: '',
        selectedTypes: [],
        selectedGeneration: null,
        sortBy: 'id',
        sortOrder: 'asc',
        currentPage: 1
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
        pageSize: state.pageSize,
      }),
    }
  )
);