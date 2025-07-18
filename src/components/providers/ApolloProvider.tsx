'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';

interface Props {
  children: React.ReactNode;
}

export function ApolloProviderWrapper({ children }: Props) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}