"use strict";

var React = require("react-native");
var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;
var BoardLib = require("./board")
var {
  WHITE,
  BLACK,
  EMPTY,
  Board,
} = BoardLib;

var App = React.createClass({
  getInitialState() {
    return new Board()
  },

  render() {
    var squares = []
    for (var y = 7; y >= 0; y--) {
      for (var x = 0; x < 8; x++) {
        var key = x + "," + y
        var letter = this.state.board[x][y]
        squares.push(<Square x={x} y={y} key={key} letter={letter} />)
      }
    }

    return (
      <View style={styles.center}>
        <View style={styles.board}>
          {squares}
        </View>
      </View>
    )
  }
})

var Square = React.createClass({
  render() {
    var colorStyle
    if ((this.props.x + this.props.y) % 2 == 0) {
      colorStyle = styles.darkSquare
    } else {
      colorStyle = styles.lightSquare
    }
    return (
      <TouchableHighlight
        style={[styles.square, colorStyle]}
        underlayColor="#67C8FF">
        <Text>
        {this.props.letter}
        </Text>
      </TouchableHighlight>
    )
  }
})

var CELL = 94

// TODO: board should be vertically centered as well
var styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    width: CELL * 8,
    height: CELL * 8,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  square: {
    width: CELL,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
  },
  darkSquare: {
    backgroundColor: "#333333",
  },
  lightSquare: {
    backgroundColor: "#cccccc",
  },
});

AppRegistry.registerComponent("Chess", () => App);
