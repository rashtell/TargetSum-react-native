/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Game from './Game';


class App extends React.Component {
  state = {
    gameId: 1
  }
  resetGame = () => (
    this.setState((prev) => prev.gameId++)
  );

  render() {
    return (
      <Game key={this.state.gameId}
        onPlayAgain={this.resetGame}
        randomNumberCount={6}
        initialSeconds={10}
      />
    );
  }
};


export default App;
