import { notFound } from 'next/navigation';
import { apolloClient } from '@/lib/apollo';
import { GET_POKEMON_DETAIL, GET_POKEMON_LIST } from '@/lib/graphql/queries';
import { PokemonDetail } from './PokemonDetail';
import { formatPokemonName } from '@/lib/utils/pokemon';

export async function generateStaticParams() {
  try {
    const { data } = await apolloClient.query({
      query: GET_POKEMON_LIST,
      variables: {
        limit: 1000,
        offset: 0,
      },
    });

    return data.pokemon_v2_pokemon.map((pokemon: { id: number }) => ({
      id: pokemon.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return Array.from({ length: 151 }, (_, i) => ({
      id: (i + 1).toString(),
    }));
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
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
      title: 'Pokemon Not Found',
    };
  }
}

export default async function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id);
  if (isNaN(numericId)) notFound();

  try {
    const { data } = await apolloClient.query({
      query: GET_POKEMON_DETAIL,
      variables: { id },
    });

    const pokemon = data.pokemon_v2_pokemon_by_pk;
    if (!pokemon) notFound();

    return <PokemonDetail pokemon={pokemon} />;
  } catch {
    notFound();
  }
}
