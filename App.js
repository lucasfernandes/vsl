import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './client';
import TweetList from './TweetList';

const App = () => (
  <ApolloProvider client={client}>
    <TweetList />
  </ApolloProvider>
);

export default App;