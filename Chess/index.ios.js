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

var CELL = 94

var Square = React.createClass({
  render() {
    var colorStyle
    if ((this.props.x + this.props.y) % 2 == 0) {
      colorStyle = styles.darkSquare
    } else {
      colorStyle = styles.lightSquare
    }
    var left = this.props.x * CELL
    var bottom = this.props.y * CELL
    var styleList = [styles.square, colorStyle,
                     {left, bottom}]
    if (this.props.letter == ".") {
      return <View style={styleList} />
    }
    return (
      <TouchableHighlight
        style={styleList}
        underlayColor="#67C8FF">
        <Text>
        {this.props.letter}
        </Text>
      </TouchableHighlight>
    )
  }
})

// TODO: board should be vertically centered as well
var styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    width: CELL * 8,
    height: CELL * 8,
    // flexWrap: "wrap",
    // flexDirection: "row",
  },
  square: {
    position: "absolute",
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
