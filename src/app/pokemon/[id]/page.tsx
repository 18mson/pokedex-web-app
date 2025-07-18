import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apolloClient } from '@/lib/apollo';
import { GET_POKEMON_DETAIL, GET_POKEMON_LIST } from '@/lib/graphql/queries';
import { PokemonDetailClient } from './PokemonDetail';
import { formatPokemonName } from '@/lib/utils/pokemon';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  try {
    const { data } = await apolloClient.query({
      query: GET_POKEMON_LIST,
      variables: { 
        limit: 1000,
        offset: 0 
      },
    });

    interface PokemonListItem {
      id: number;
    }

    return data.pokemon_v2_pokemon.map((pokemon: PokemonListItem) => ({
      id: pokemon.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return a fallback set of common Pokemon IDs
    return Array.from({ length: 151 }, (_, i) => ({
      id: (i + 1).toString(),
    }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return {
      title: 'Pokemon Not Found',
    };
  }

  try {
    const { data } = await apolloClient.query({
      query: GET_POKEMON_DETAIL,
      variables: { id },
    });

    const pokemon = data.pokemon_v2_pokemon_by_pk;
    if (!pokemon) {
      return {
        title: 'Pokemon Not Found',
      };
    }

    return {
      title: `${formatPokemonName(pokemon.name)} - Pokédex`,
      description: `Detailed information about ${formatPokemonName(pokemon.name)}, including stats, types, abilities, and evolution chain.`,
      openGraph: {
        title: `${formatPokemonName(pokemon.name)} - Pokédex`,
        description: `Discover everything about ${formatPokemonName(pokemon.name)}`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: `Pokemon Not Found`,
    };
  }
}

export default async function PokemonDetailPage({ params }: Props) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    notFound();
  }

  try {
    const { data } = await apolloClient.query({
      query: GET_POKEMON_DETAIL,
      variables: { id },
    });

    const pokemon = data.pokemon_v2_pokemon_by_pk;
    if (!pokemon) {
      notFound();
    }

    return <PokemonDetailClient pokemon={pokemon} />;
  } catch {
    notFound();
  }
}