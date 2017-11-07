import { ApolloClient } from 'apollo-client';

import { InMemoryCache } from 'apollo-cache-inmemory';

import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const wsLink = new WebSocketLink({
  uri: 'wss://subscriptions.graph.cool/v1/cj9or18r10tgj0147y4wxrxqe',
  options: { reconnect: true },
});

const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cj9or18r10tgj0147y4wxrxqe',
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;