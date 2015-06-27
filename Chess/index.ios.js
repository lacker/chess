"use strict";

var React = require("react-native");
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var App = React.createClass({
  render: function() {

    var squares = []
    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
        squares.push(<Square x={x} y={y} />)
      }
    }

    return (
      <View>
        {squares}
      </View>
    )
  }
})

var Square = React.createClass({
  render() {
    var location = {
      left: this.props.x * 50,
      top: this.props.y * 50,
    }
    var colorStyle
    if ((this.props.x + this.props.y) % 2 == 0) {
      colorStyle = styles.darkSquare
    } else {
      colorStyle = styles.lightSquare
    }
    return <View style={[styles.square, colorStyle, location]} />
  }
})

var styles = StyleSheet.create({
  square: {
    width: 50,
    height: 50,
  },
  darkSquare: {
    backgroundColor: "#333333",
  },
  lightSquare: {
    backgroundColor: "#cccccc",
  },
});

AppRegistry.registerComponent("Chess", () => App);
