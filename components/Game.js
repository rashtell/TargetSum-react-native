import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shuffle from "lodash.shuffle";
import {
  Text,
  View,
  Button,
  StyleSheet,
} from 'react-native'

import RandomNumber from './RandomNumber';


class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {
    selectedIds: [],
    remainigSeconds: this.props.initialSeconds,
  };

  componentDidMount() {
    this.intervalId = setInterval(() => this.setState(
      (prev) => --prev.remainigSeconds,
      () => {
        if (this.state.remainigSeconds === 0) return clearInterval(this.intervalId)
      }
    ),1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds || nextState.remainigSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  randomNumbers = Array
    .from({ length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  shuffledRandomNumbers = shuffle(this.randomNumbers)

  isNumberSelected = (numberIndex) => (
    this.state.selectedIds.indexOf(numberIndex)>=0
  )

  selectedNumber = (numberIndex) => (
    this.setState((prev) => ({ selectedIds: [...prev.selectedIds, numberIndex] }))
  )

  gameStatus = 'PLAYING'

  calcGameStatus(nextState) {
    const sumSelected = nextState.selectedIds.reduce((acc, cur) => acc + this.shuffledRandomNumbers[cur], 0);
    if (nextState.remainigSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected == this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }

  }

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}
      >
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}
        >
          {this.target}
        </Text>
        <View style={styles.randomContainer}
        >
          {this.shuffledRandomNumbers.map((randomNumber, index) =>
            <RandomNumber key={index}
              id={index}
              number={randomNumber}
              isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
              onPress={this.selectedNumber}
            />
          )}
        </View>
        {this.gameStatus !== 'PLAYING' && (<Button title='Play Again' onPress={this.props.onPlayAgain} />)}
        <Text>
          {this.state.remainigSeconds}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },

  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    marginHorizontal: 50,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb'
  },
  STATUS_WON: {
    backgroundColor: 'green'
  },
  STATUS_LOST: {
    backgroundColor: 'red'
  },
})

export default Game;