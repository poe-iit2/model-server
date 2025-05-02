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
    url: `ws://${window.location.host}/graphqlws`,
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
      <div className="container">
            <div className="header">
              <div className="menu-icon">&#9776;</div>
              <h1>Soteria Room Monitoring Status</h1>
            </div>
            <div className="rooms">

              <DeviceMonitor deviceId={0} />
              <DeviceMonitor deviceId={1} />
            </div>  
          {/* <!-- Add Room Dynamically Section --> */}
          <div className  ="add-room">
            <button> + Add New Room</button>
          </div>  ` `
      </div>
    </ApolloProvider>
  );
}

export default App;