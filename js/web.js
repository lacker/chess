import React from 'react';  

const board = require("./board.js")
const Board = board.Board
console.log("white = " + board.WHITE)

let App = React.createClass({  
  render() {
    return (
      <div>
        hello react world!
      </div>
    );
  }
})

React.render(<App/>, document.body);


