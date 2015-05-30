#!/usr/local/bin/node
// Written for node v0.10.20
// TODO: convert to ES6

function Board() {
  // Each square's content has a character representation.
  // Standard chess notation for pieces, caps is white, . is empty.
  // [0][0] is a1, [7][0] is h1, [7][7] is h8.
  this.squares = ["RP....pr",
                  "NP....pn",
                  "BP....pb",
                  "QP....pq",
                  "KP....pk",
                  "BP....pb",
                  "NP....pn",
                  "RP....pr"]
}

// "a1" -> [0, 0]
function coordsForSquare(square) {
  return [square[0].charCodeAt(0) - "a".charCodeAt(0),
          square[1].charCodeAt(0) - "1".charCodeAt(0)]
}

// (0, 0) -> "a1"
function squareForCoords(x, y) {
  return (String.fromCharCode("a".charCodeAt(0) + x) +
          String.fromCharCode("1".charCodeAt(0) + y))
}

// square is in "e4" type notation
Board.prototype.pieceForSquare = function(square) {
  var coords = coordsForSquare(square)
  var x = coords[0]
  var y = coords[1]
  return this.squares[x][y]
}

// Tests
var b = new Board()
if (b.pieceForSquare("e1") != "K") throw "pieceForSquare failed"

