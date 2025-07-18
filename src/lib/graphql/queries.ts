import { gql } from '@apollo/client';

export const GET_POKEMON_LIST = gql`
  query GetPokemonList($limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
        pokemon_v2_generation {
          name
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAIL = gql`
  query GetPokemonDetail($id: Int!) {
    pokemon_v2_pokemon_by_pk(id: $id) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
        pokemon_v2_generation {
          name
        }
        pokemon_v2_pokemonspeciesnames(where: { language_id: { _eq: 9 } }) {
          genus
        }
        pokemon_v2_pokemonspeciesflavortexts(
          where: { language_id: { _eq: 9 } }
          limit: 1
        ) {
          flavor_text
        }
        evolves_from_species_id
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies {
            id
            name
            pokemon_v2_pokemons(limit: 1) {
              id
              name
            }
          }
        }
      }
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
          pokemon_v2_abilitynames(where: { language_id: { _eq: 9 } }) {
            name
          }
        }
      }
      pokemon_v2_pokemonmoves(limit: 10) {
        pokemon_v2_move {
          name
          power
          accuracy
          pokemon_v2_type {
            name
          }
          pokemon_v2_movenames(where: { language_id: { _eq: 9 } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_TYPES = gql`
  query GetPokemonTypes {
    pokemon_v2_type(order_by: { id: asc }) {
      id
      name
    }
  }
`;

export const SEARCH_POKEMON = gql`
  query SearchPokemon($name: String!) {
    pokemon_v2_pokemon(where: { name: { _ilike: $name } }, limit: 20) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
        pokemon_v2_generation {
          name
        }
      }
    }
  }
`;