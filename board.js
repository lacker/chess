#!/usr/local/bin/node
// Written for node v0.10.20
// TODO: convert to ES6
// TODO: use modules

// The chess colors. Convenient for multiplying vectors.
var WHITE = 1
var EMPTY = 0
var BLACK = -1

function Board() {
  // Each square's content has a character representation.
  // Standard chess notation for pieces, caps is white, . is empty.
  // [0][0] is a1, [7][0] is h1, [7][7] is h8.
  // Typically we refer to these two indices as x and y.
  this.board = ["RP....pr",
                "NP....pn",
                "BP....pb",
                "QP....pq",
                "KP....pk",
                "BP....pb",
                "NP....pn",
                "RP....pr"]

  // The square that an en-passant capture can move into.
  // null if there is none
  this.passant = null
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

function validCoords(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}

function colorForPiece(piece) {
  if (piece >= "a" && piece <= "z") {
    return BLACK
  }
  if (piece >= "A" && piece <= "Z") {
    return WHITE
  }
  if (piece == ".") {
    return EMPTY
  }
  throw ("invalid piece: " + piece)
}

Board.prototype.colorForCoords = function(x, y) {
  return colorForPiece(this.board[x][y])
}

// square is in "e4" type notation
Board.prototype.pieceForSquare = function(square) {
  var coords = coordsForSquare(square)
  var x = coords[0]
  var y = coords[1]
  return this.board[x][y]
}

// A list of [x, y] coords that a knight can move to.
// This ignores "no moving into check".
Board.prototype.knightMoves = function(color, x, y) {
  var deltas = [[1, 2],
                [2, 1],
                [-1, 2],
                [2, -1],
                [1, -2],
                [-2, 1],
                [-1, -2],
                [-2, -1]]
  var answer = []
  for (var i = 0; i < deltas.length; i++) {
    var newx = x + deltas[i][0]
    var newy = y + deltas[i][1]
    if (validCoords(newx, newy) &&
        this.colorForCoords(newx, newy) != color) {
      answer.push([newx, newy])
    }
  }

  return answer
}

// Testing

function testEq(name, foo, bar) {
  if (foo != bar) {
    throw ("in " + name + " test: " + foo + " != " + bar)
  }
}

var b = new Board()
testEq("pieceForSquare", "K", b.pieceForSquare("e1"))
testEq("validCoords", false, validCoords(4, 8))
testEq("colorForCoords", WHITE, b.colorForCoords(6, 1))
testEq("colorForCoords", BLACK, b.colorForCoords(3, 7))
testEq("colorForCoords", EMPTY, b.colorForCoords(2, 2))
testEq("knightMoves", 2, b.knightMoves(WHITE, 1, 0).length)
