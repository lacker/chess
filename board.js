#!/usr/local/bin/node
// Written for node v0.10.20

function Board() {
  // Stored in [row][column] storage graphically. White on bottom.
  // This is annoyingly opposite from chess numbering; let's see if I
  // regret that.
  // This does make it so that squares is the same order as FEN
  // notation squares.
  this.squares = ["rnbqkbnr",
                  "pppppppp",
                  "........",
                  "........",
                  "........",
                  "........",
                  "PPPPPPPP",
                  "RNBQKBNR"]
}

// square is in "e4" type notation
Board.prototype.get = function(square) {
  // "8" -> 0, "1" -> 7
  var row = "8".charCodeAt(0) - square[1].charCodeAt(0)

  // "a" -> 0, "h" -> 7
  var col = square[0].charCodeAt(0) - "a".charCodeAt(0)

  return this.squares[row][col]
}

// Tests
var b = new Board()
if (b.get("e1") != "K") throw "e1 failed"
