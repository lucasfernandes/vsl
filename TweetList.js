import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';
import gql  from 'graphql-tag';

import { Container, Content, Header, Title, Body, List, ListItem, Text, Spinner } from 'native-base';

class TweetList extends Component{
  componentWillMount() {
    this.props.subscribeToNewTweets();
  }

  render(){
    if(this.props.tweets.loading)
      return(
         <Container style={styles.loadingContainer}>
           <Content>
             <Spinner color="#000" />
             <Text>Carregando tweets</Text>
           </Content>
         </Container> 
      );

    return(
      <Container>
        <Header>
          <Body>
            <Title>SkeleTwitter</Title>
          </Body>
        </Header>
        <Content>
          <List>
            { this.props.tweets.allTweets.map(tweet => (  
              <ListItem key={tweet.id}>
                <Body>
                  <Text>{tweet.text}</Text>
                  <Text note>{tweet.author}</Text>
                </Body>
              </ListItem>
            ))}
          </List>
        </Content>
      </Container>
    );
  }
}

const TWEETS_QUERY = gql`
  query {
    allTweets {
      id
      author
      text
    }
  }
`;
export default graphql(TWEETS_QUERY, 
  { name: 'tweets', 
  props: props => ({
    ...props,
    subscribeToNewTweets: params => props.tweets.subscribeToMore({
      document: gql`
        subscription onTweetAdded {
          Tweet {
            node {
              id
              author
              text
            }
          }
        }
      `,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData['Tweet']) return prev;

        const newTweet = subscriptionData['Tweet'].node;

        return {
          ...prev,
          allTweets: [
            newTweet,
            ...prev.allTweets,
          ]
        }
      }
    })
  })
})(TweetList);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingVertical: 50,
    alignItems: 'center',
  }
})