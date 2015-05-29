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

// "a8" -> 0, "a1" -> 7
function rowForSquare(square) {
  return "8".charCodeAt(0) - square[1].charCodeAt(0)
}

// "a1" -> 0, "h1" -> 7
function colForSquare(square) {
  return square[0].charCodeAt(0) - "a".charCodeAt(0)
}

// square is in "e4" type notation
Board.prototype.pieceForSquare = function(square) {
  return this.squares[rowForSquare(square)][colForSquare(square)]
}

Board.prototype.pieceForRowCol = function(row, col) {
  return this.squares[row][col]
}

// Tests
var b = new Board()
if (b.pieceForSquare("e1") != "K") throw "pieceForSquare failed"
if (b.pieceForRowCol(7, 4) != "K") throw "pieceForRowCol failed"
