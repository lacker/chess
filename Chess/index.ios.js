"use strict";

var React = require("react-native");
var {
  AppRegistry,
  StyleSheet,
  Text,
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
  render: function() {
    // TODO: read from somewhere
    var board = new Board()

    var squares = []
    for (var y = 7; y >= 0; y--) {
      for (var x = 0; x < 8; x++) {
        var key = x + "," + y
        var letter = board.board[x][y]
        squares.push(<Square x={x} y={y} key={key} letter={letter} />)
      }
    }

    return (
      <View style={styles.board}>
        {squares}
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
        <View style={[styles.square, colorStyle]}>
        <Text>
        {this.props.letter}
        </Text>
        </View>
    )
  }
})

var CELL = 50

var styles = StyleSheet.create({
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
