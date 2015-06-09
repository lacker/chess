import React from "react";  

const board = require("./board.js")
console.log("white = " + board.WHITE)

// TODO: render a pieceless chessboard

const App = React.createClass({  
  getInitialState() {
    return { board: new board.Board() }
  },

  render() {
    let squares = []
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        squares.push(<Square x={x} y={y} />)
      }
    }

    return (
      <div className="board">
      {squares}
      </div>
    );
  }
})

const Square = React.createClass({
  render() {
    const size = 50
    let style = {
      left: this.props.x * size,
      bottom: this.props.y * size,
    }
    if ((this.props.x + this.props.y) % 2 == 0) {
      // Dark square
    } else {
      // Light square
    }
  }
})

React.render(<App/>, document.body);


