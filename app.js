// @flow
import React, { PureComponent } from "react";
import { Button, View, Text } from "react-native";
// $FlowFixMe
import { ApolloClient, createNetworkInterface, ApolloProvider, gql, graphql } from 'react-apollo';
import type { OperationComponent, ChildProps } from "react-apollo";

type AllTrips = Array<{id: string}>;
type Response = { allTrips: AllTrips };

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://graphql-demo.commonsware.com/0.2/graphql',
  }),
});

type State = { counter: number };

class TheGraphQLThing extends PureComponent {
    props: ChildProps<{}, Response>;
    state: State = {
        counter: 0,
    };
    
    render() {
        const {
            loading,
            allTrips,
        } = this.props.data;
        
        const {
            counter,
        } = this.state;
        
        if (loading) {
            return <Text>Loading</Text>;
        }

        return (
            <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text>Number of trips: {allTrips.length}</Text>
                <Button
                    onPress={() => this.setState({ counter: counter + 1 })}
                    title={`Increment ${counter} to ${counter+1}`}
                />
            </View>
        );
    }
}

const withQuery: OperationComponent<Response> = graphql(
    gql`query { allTrips { id } }`
);
const TheGraphQLThingContainer = withQuery(TheGraphQLThing);

const App = () => {
    return (
        <ApolloProvider client={client}>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <TheGraphQLThingContainer />
            </View>
        </ApolloProvider>
    )
};

export default App;