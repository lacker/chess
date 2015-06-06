import React from "react";  

const board = require("./board.js")
console.log("white = " + board.WHITE)

const App = React.createClass({  
  getInitialState() {
    return { board: new board.Board() }
  },

  render() {
    return (
      <div>
        hello react world!
      </div>
    );
  }
})

React.render(<App/>, document.body);


