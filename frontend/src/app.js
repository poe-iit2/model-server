import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import DeviceMonitor from './components/DeviceMonitor';

// Create an HTTP link for queries/mutations
const httpLink = new HttpLink({
  uri: '/graphql',
});

// Create a WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${window.location.host}/`,
  }),
);

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Create Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header>
          <h1>Device Monitoring System</h1>
        </header>
        <main>
          <DeviceMonitor deviceId={0} />
          <DeviceMonitor deviceId={1} />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;