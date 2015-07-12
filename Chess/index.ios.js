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
  getInitialState() {
    var board = new Board()
    var selected = null
    return {board, selected}
  },

  select(x, y) {
    console.log("select(" + x + "," + y + ")")
    this.setState({selected: [x, y]})
  },

  isSelected(x, y) {
    return (this.state.selected &&
            this.state.selected[0] == x &&
            this.state.selected[1] == y)
  },

  render() {
    var squares = []
    for (var y = 7; y >= 0; y--) {
      for (var x = 0; x < 8; x++) {
        var key = x + "," + y
        var letter = this.state.board.board[x][y]
        squares.push(<Square x={x} y={y} key={key} letter={letter}
                      selected={this.isSelected(x, y)}
                      onSelect={(x, y) => this.select(x, y)} />)
      }
    }

    return (
      <View style={styles.center}>
        <View style={styles.board}>
          {squares}
        </View>
      </View>
    )
  },
})

var CELL = 94

var Square = React.createClass({
  getInitialState() {
    return {}
  },

  render() {
    var colorStyle
    if (this.props.selected) {
      colorStyle = styles.selectedSquare
    } else if ((this.props.x + this.props.y) % 2 == 0) {
      colorStyle = styles.darkSquare
    } else {
      colorStyle = styles.lightSquare
    }
    var left = this.props.x * CELL
    var bottom = this.props.y * CELL
    var styleList = [styles.square, colorStyle,
                     {left, bottom}]

    var letter = (this.props.letter == ".") ? "" : this.props.letter
    var pieceStyle
    if (letter.toUpperCase() != letter) {
      letter = letter.toUpperCase()
      pieceStyle = styles.darkPiece
    } else {
      pieceStyle = styles.lightPiece
    }
    
    return (
      <View
        style={styleList}
        onStartShouldSetResponder={this._onStartShouldSetResponder}
        onResponderMove={this._onResponderMove}
        onResponderRelease={this._onResponderRelease}
        >
        <Text style={pieceStyle}>
        {letter}
        </Text>
      </View>
    )
  },

  _onStartShouldSetResponder: function(e) {
    console.log("onStartShouldSetResponder")
    this.props.onSelect(this.props.x, this.props.y)
    return true
  },

  _onResponderMove: function(e) {
    console.log("onResponderMover")
  },

  _onResponderRelease: function(e) {
    console.log("onResponderRelease")
  },
})

// TODO: board should be vertically centered as well
var styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    top: 120,
    width: CELL * 8,
    height: CELL * 8,
  },
  square: {
    position: "absolute",
    width: CELL,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
  },
  darkSquare: {
    backgroundColor: "#876543",
  },
  lightSquare: {
    backgroundColor: "#fecb87",
  },
  selectedSquare: {
    backgroundColor: "#ff0000",
  },
  darkPiece: {
    color: "#000000",
    fontSize: 47,
    fontWeight: "bold",
  },
  lightPiece: {
    color: "#ffffff",
    fontSize: 47,
    fontWeight: "bold",
  },
});

AppRegistry.registerComponent("Chess", () => App);
