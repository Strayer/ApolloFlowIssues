// @flow
import React, { PureComponent } from "react";
import { Button, View, Text } from "react-native";
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import type { Store } from 'redux';
import type { Dispatch } from "redux";
import { ApolloClient, createNetworkInterface, ApolloProvider, gql, graphql } from 'react-apollo';
import type { OperationComponent } from "react-apollo";

type State = number;
type Action = {type: "INCREMENT"} | {type: "DECREMENT"};

type AllTrips = Array<{id: string}>;
type Response = { allTrips: AllTrips };

const reducer: (State, Action) => State = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
};
const store: Store<State, Action> = createStore(reducer);

const mapStateToProps = (state: State) => {
    return {
        counter: state,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => {
    return {
        onIncrement: () => {
            dispatch({type:"INCREMENT"})
        },
    };
};

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://graphql-demo.commonsware.com/0.2/graphql',
  }),
});

class TheButton extends PureComponent {
    props: {
        counter: number,
        onIncrement: () => void,
    };
    
    render() {
        const {
            counter,
            onIncrement,
        } = this.props;
        
        return <Button
            onPress={onIncrement} 
            title={`Increment from ${counter} to ${counter+1}`} 
        />
        ;
    }
}

const TheButtonContainer = connect(mapStateToProps, mapDispatchToProps)(TheButton);

class TheGraphQLThing extends PureComponent {
    render() {
        const {
            loading,
            allTrips,
        } = this.props.data;
        
        if (loading) {
            return <Text>Loading</Text>;
        }
        
        // $FlowFixMe remove this comment to test prop types
        const shouldCauseAFlowError: number = allTrips[0].test;
        
        return <Text>Number of trips: {allTrips.length}</Text>;
    }
}

const withQuery: OperationComponent<Response> = graphql(
    gql`query { allTrips { id } }`
);
const TheGraphQLThingContainer = withQuery(TheGraphQLThing);

const App = () => {
    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <TheButtonContainer />
                    <TheGraphQLThingContainer />
                </View>
            </ApolloProvider>
        </Provider>
    )
};

export default App;