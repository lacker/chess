"use strict";

var React = require("react-native");
var {
  AppRegistry,
  Image,
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
var TimerMixin = require("react-timer-mixin")
var Video = require("react-native-video")

var App = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    var board = new Board()
    var selected = null
    var sound = null
    return {board, selected, sound}
  },

  select(x, y) {
    if (this.state.board.gameOver()) {
      // Play a new game
      this.state.board.construct()
      this.forceUpdate()      
      return
    }

    if (this.state.board.turn != WHITE) {
      // The human is playing White, so ignore selections when it's
      // not White's turn
      return
    }

    if (this.state.selected) {
      var fromX = this.state.selected[0]
      var fromY = this.state.selected[1]

      if (fromX == x && fromY == y) {
        // We are canceling a move by re-selecting the selection
        this.setState({selected: null})
        return
      }

      if (this.state.board.isValidMove(fromX, fromY, x, y)) {
        // We are making a move
        console.log("makeMove(" + fromX + "," + fromY + "," + x + "," + y + ")")
        this.state.board.makeMove(fromX, fromY, x, y)
        this.setState({selected: null})

        if (!this.state.board.gameOver()) {
          // Make a random opponent move in a couple seconds
          this.setTimeout(
            () => {
              this.state.board.makeRandomMoveIfPossible()
              this.forceUpdate()
            }, 2000)
          return
        }
      }
    }
    
    // Check if we're selecting a piece that can move
    var destinations = this.state.board.validMovesFrom(x, y)
    if (destinations.length == 0) {
      return
    }
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
    var hintList = []
    if (this.state.selected) {
      hintList = this.state.board.validMovesFrom(this.state.selected[0],
                                                 this.state.selected[1])
    } else if (this.state.board.turn == WHITE) {
      if (this.state.board.lastMove != null) {
        var [fromX, fromY, toX, toY] = this.state.board.lastMove

        // Show the black player's last move as "hinted"
        hintList = [[fromX, fromY], [toX, toY]]
      }
    }

    // Create a set of strings to work around the nonexistence of nice
    // set-of-tuple-of-int types
    var hintSet = {}
    for (var xy of hintList) {
      hintSet[`${xy[0]},${xy[1]}`] = true
    }

    for (var y = 7; y >= 0; y--) {
      for (var x = 0; x < 8; x++) {
        var key = x + "," + y
        var letter = this.state.board.board[x][y]
        squares.push(<Square x={x} y={y} key={key} letter={letter}
                      selected={this.isSelected(x, y)}
                      hinted={hintSet[key]}
                      onSelect={(x, y) => this.select(x, y)} />)
      }
    }

    var message = ""
    var winner = this.state.board.getWinner()
    if (winner == WHITE) {
      message = "you win!"
    } else if (winner == BLACK) {
      message = "you lose."
    } else if (this.state.board.isStalemate()) {
      message = "it's a draw."
    }

    return (
        <View style={styles.enclosing}>
          <GameAudio sound={this.state.sound} />
          <View style={styles.header} />
          <View style={styles.board}>
            {squares}
          </View>
          <View style={styles.footer}>
            <Text style={styles.message}>
              {message}
            </Text>
          </View>
        </View>
    )
  },
})

// Plays a sound provided in "sound" at render time, and that's it.
var GameAudio = React.createClass({
  render() {
    if (!this.props.sound) {
      return null
    }

    return (
        <Video
          source={{uri: this.props.sound}}
          style={styles.backgroundVideo}
        />)
  },
})

var CELL = 94

var Square = React.createClass({
  getInitialState() {
    return {}
  },

  // Renders just the piece based on this.props.letter
  renderPiece() {
    var letter = (this.props.letter == ".") ? "" : this.props.letter

    var iconMap = {
      k: require("image!black_king"),
      q: require("image!black_queen"),
      r: require("image!black_rook"),
      b: require("image!black_bishop"),
      n: require("image!black_knight"),
      p: require("image!black_pawn"),
      K: require("image!white_king"),
      Q: require("image!white_queen"),
      R: require("image!white_rook"),
      B: require("image!white_bishop"),
      N: require("image!white_knight"),
      P: require("image!white_pawn"),
    }
    var icon = iconMap[letter]
    if (icon) {
      return (<Image
              style={styles.piece}
              source={icon}
              />)
    }
    
    return <View />
  },

  render() {
    var highlight = this.props.hinted || this.props.selected
    var colorStyle
    if ((this.props.x + this.props.y) % 2 == 0) {
      colorStyle = highlight ? styles.darkHighlight : styles.darkSquare
    } else {
      colorStyle = highlight ? styles.lightHighlight : styles.lightSquare
    }
    var left = this.props.x * CELL
    var bottom = this.props.y * CELL
    var styleList = [styles.square, colorStyle,
                     {left, bottom}]

    if (this.props.hinted) {
      styleList.push(styles.hinted)
    }

    return (
      <View
        style={styleList}
        onStartShouldSetResponder={this._onStartShouldSetResponder}
        onResponderMove={this._onResponderMove}
        onResponderRelease={this._onResponderRelease}
        >
        {this.renderPiece()}
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

var styles = StyleSheet.create({
  enclosing: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
    flex: 1,
  },
  board: {
    width: CELL * 8,
    height: CELL * 8,
  },
  // The header doesn't get rendered, and to verify that we give it a
  // nonsense color. It's just used for spacing.
  header: {
    backgroundColor: "#00FF00",
    flex: 1,
  },
  footer: {
    justifyContent: "center",
    flex: 1,
  },
  message: {
    fontSize: 48,
  },

  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  // For squares
  square: {
    position: "absolute",
    width: CELL,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
  },
  darkSquare: {
    backgroundColor: "#8CA2AD",
  },
  lightSquare: {
    backgroundColor: "#DEE3E6",
  },
  darkHighlight: {
    backgroundColor: "#92B165",
  },
  lightHighlight: {
    backgroundColor: "#C2D787",
  },

  piece: {
    width: CELL,
    height: CELL,
  },
});

AppRegistry.registerComponent("Chess", () => App);
