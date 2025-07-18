import { SearchBar } from '@/components/searchBar/SearchBar';
import { FilterPanel } from '@/components/filter/Filter';
import { Grid } from '@/components/layout/Grid';

export default function HomePage() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <div className="text-center mb-8 mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Discover the World of{' '}
          <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
            Pokémon
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Search, filter, and compare your favorite Pokémon. Explore detailed stats, 
          types, abilities, and evolution chains in this comprehensive Pokédex.
        </p>
      </div>

      <div className="flex gap-4 justify-center w-full">
        <div className="lg:w-80 sticky top-20 self-start hidden lg:block">
          <FilterPanel />
        </div>
        <div className="flex-1">
          <div className="flex flex-1 items-center sticky top-20 self-start z-20 h-14 py-0.5 mb-4 backdrop-blur-sm">
            <div className="lg:hidden block pr-1">
              <FilterPanel />
            </div>
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>
          <Grid />
        </div>
      </div>
    </div>
  );
}