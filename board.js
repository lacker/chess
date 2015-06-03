#!/usr/local/bin/node
// Written for node v0.10.20

// The chess colors. Convenient for multiplying vectors.
var WHITE = 1
var EMPTY = 0
var BLACK = -1

// Can also reinflate a board that was stringified.
function Board(data) {
  if (typeof data == "string") {
    data = JSON.parse(data)
  }

  // Each square's content has a character representation.
  // Standard chess notation for pieces, caps is white, . is empty.
  // [0][0] is a1, [7][0] is h1, [7][7] is h8.
  // Typically we refer to these two indices as x and y.
  this.board = (data && data.board) ||
    [["R","P",".",".",".",".","p","r"],
     ["N","P",".",".",".",".","p","n"],
     ["B","P",".",".",".",".","p","b"],
     ["Q","P",".",".",".",".","p","q"],
     ["K","P",".",".",".",".","p","k"],
     ["B","P",".",".",".",".","p","b"],
     ["N","P",".",".",".",".","p","n"],
     ["R","P",".",".",".",".","p","r"]]

  // Whose turn it is to move
  this.turn = (data && data.turn) || WHITE

  // The square that an en-passant capture can move into.
  // null if there is none
  this.passant = (data && data.passant) || null
}

// "a1" -> [0, 0]
function coordsForSquare(square) {
  return [square[0].charCodeAt(0) - "a".charCodeAt(0),
          square[1].charCodeAt(0) - "1".charCodeAt(0)]
}

// Converts Smith notation into a "move" like we use.
// Only handles len-4 Smith notation.
// I.e., "e2e4" -> [4, 1, 4, 3]
function moveForSmith(smith) {
  if (smith.length != 4) {
    throw "bad smith: " + smith
  }
  var fromCoords = coordsForSquare(smith[0] + smith[1])
  var toCoords = coordsForSquare(smith[2] + smith[3])
  return fromCoords.concat(toCoords)
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

// Converts to JSON. The constructor accepts this
Board.prototype.stringify = function() {
  return JSON.stringify({
    board: this.board,
    passant: this.passant,
    turn: this.turn
  })
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

// A list of moves that a piece can make, if its valid
// moves are given by the provided list of [dx, dy] hop deltas.
// (Useful for kings and knights.)
Board.prototype.hopMoves = function(deltas, x, y) {
  var answer = []
  for (var i = 0; i < deltas.length; i++) {
    var newx = x + deltas[i][0]
    var newy = y + deltas[i][1]
    if (validCoords(newx, newy) &&
        this.colorForCoords(newx, newy) != this.turn) {
      answer.push([x, y, newx, newy])
    }
  }

  return answer
}

// A list of [x, y] coords that a knight can move to.
Board.prototype.knightMoves = function(x, y) {
  var deltas = [[1, 2],
                [2, 1],
                [-1, 2],
                [2, -1],
                [1, -2],
                [-2, 1],
                [-1, -2],
                [-2, -1]]
  return this.hopMoves(deltas, x, y)
}

var BISHOP_STEPS = [[1, 1],
                     [-1, 1],
                     [-1, -1],
                     [1, -1]]
var ROOK_STEPS = [[1, 0],
                  [0, 1],
                  [-1, 0],
                  [0, -1]]
var QUEEN_STEPS = BISHOP_STEPS.concat(ROOK_STEPS)

// A list of moves that a king on (x, y) can make.
// Does not count castling.
Board.prototype.kingMoves = function(x, y) {
  return this.hopMoves(QUEEN_STEPS, x, y)
}

// A list of moves that a piece can make, if its valid
// moves are given by the provided list of deltas, plus it can repeat
// them as much as it wants.
Board.prototype.slideMoves = function(deltas, x, y) {
  var answer = []
  for (var i = 0; i < deltas.length; i++) {
    var dx = deltas[i][0]
    var dy = deltas[i][1]
    var newx = x
    var newy = y
    while (true) {
      newx += dx
      newy += dy
      if (!validCoords(newx, newy)) {
        break
      }
      var colorAt = this.colorForCoords(newx, newy)
      if (colorAt == this.turn) {
        break
      }
      answer.push([x, y, newx, newy])
      if (colorAt == -this.turn) {
        break
      }
    }
  }
  return answer
}

Board.prototype.bishopMoves = function(x, y) {
  return this.slideMoves(BISHOP_STEPS, x, y)
}
Board.prototype.rookMoves = function(x, y) {
  return this.slideMoves(ROOK_STEPS, x, y)
}
Board.prototype.queenMoves = function(x, y) {
  return this.slideMoves(QUEEN_STEPS, x, y)
}

Board.prototype.pawnMoves = function(x, y) {
  var answer = []
  if (validCoords(x, y + this.turn) &&
      this.colorForCoords(x, y + this.turn) == EMPTY) {
    // We can push this pawn one square
    answer.push([x, y, x, y + this.turn])

    if ((y == 1 && this.turn == WHITE) ||
        (y == 6 && this.turn == BLACK)) {
      // This pawn is in the right location to do a double-push
      if (this.colorForCoords(x, y + 2 * this.turn) == EMPTY) {
        // We can push this pawn two squares
        answer.push([x, y, x, y + 2 * this.turn])
      }
    }
  }

  // Captures
  var newxs = [x - 1, x + 1]
  for (var i = 0; i < newxs.length; i++) {
    var newx = newxs[i]
    if (validCoords(newx, y + this.turn) &&
        (this.colorForCoords(newx, y + this.turn) == -this.turn)) {
      // We can capture normally
      answer.push([x, y, newx, y + this.turn])
    } else if (this.passant != null &&
               this.passant[0] == newx &&
               this.passant[1] == y + this.turn) {
      // We can capture en passant
      answer.push([x, y, newx, y + this.turn])
    }
  }

  return answer
}

// This finds all the valid moves if you allow the mover to create a
// situation in which they are in check, or castle through check.
// Returns a list of moves in [fromx, fromy, tox, toy] format.
Board.prototype.validMovesIgnoringCheck = function() {
  var answer = []
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if (this.colorForCoords(x, y) != this.turn) {
        continue
      }

      var piece = this.board[x][y].toUpperCase()
      switch(piece) {
      case "R":
        answer = answer.concat(this.rookMoves(x, y))
        break
      case "N":
        answer = answer.concat(this.knightMoves(x, y))
        break
      case "B":
        answer = answer.concat(this.bishopMoves(x, y))
        break
      case "Q":
        answer = answer.concat(this.queenMoves(x, y))
        break
      case "K":
        answer = answer.concat(this.kingMoves(x, y))
        break
      case "P":
        answer = answer.concat(this.pawnMoves(x, y))
        break
      default:
        throw ("unrecognized piece: " + piece)
      }
    }
  }

  return answer
}

Board.prototype.copy = function() {
  return new Board(this.stringify())
}

Board.prototype.isKingsideCastle = function(fromX, fromY, toX, toY) {
  var piece = this.board[fromX][fromY]
  return (piece.toUpperCase() == "K" && fromX == 4 && toX == 6)
}

Board.prototype.isQueensideCastle = function(fromX, fromY, toX, toY) {
  var piece = this.board[fromX][fromY]
  return (piece.toUpperCase() == "K" && fromX == 4 && toX == 2)
}

Board.prototype.makeMove = function(fromX, fromY, toX, toY) {
  var piece = this.board[fromX][fromY]
  var isPawn = piece.toUpperCase() == "P"

  // Remove pawns that were captured en passant
  if (isPawn && fromX != toX && this.board[toX][toY] == ".") {
    // It's an en passant capture
    this.board[toX][fromY] = "."
  }

  var queenY = (this.turn == WHITE ? 7 : 0)
  if (isPawn && toY == queenY) {
    this.board[toX][toY] = (this.turn == WHITE ? "Q" : "q")
  } else {
    this.board[toX][toY] = piece
  }
  this.board[fromX][fromY] = "."
  this.turn = -this.turn

  // Track the en passant square
  if (piece.toUpperCase() == "P" && Math.abs(fromY - toY) == 2) {
    this.passant = [fromX, (fromY + toY) / 2]
  } else {
    this.passant = null
  }

  // Kingside castling
  if (this.isKingsideCastle(fromX, fromY, toX, toY)) {
    this.board[5][fromY] = this.board[7][fromY]
    this.board[7][fromY] = "."
  }

  // Queenside castling
  if (this.isQueensideCastle(fromX, fromY, toX, toY)) {
    this.board[3][fromY] = this.board[0][fromY]
    this.board[0][fromY] = "."
  }
}

Board.prototype.canTakeKing = function() {
  var moves = this.validMovesIgnoringCheck()
  for (var i = 0; i < moves.length; i++) {
    var x = moves[i][2]
    var y = moves[i][3]
    if (this.board[x][y].toUpperCase() == "K") {
      return true
    }
  }
  return false
}

Board.prototype.isCheck = function() {
  var copy = this.copy()
  return copy.canTakeKing()
}

Board.prototype.isCheckmate = function() {
  return this.validMoves().length == 0 && this.isCheck()
}

Board.prototype.isStalemate = function() {
  return this.validMoves().length == 0 && !this.isCheck()
}

Board.prototype.movesIntoCheck = function(fromX, fromY, toX, toY) {
  var copy = this.copy()
  copy.makeMove(fromX, fromY, toX, toY)
  return copy.canTakeKing()
}

// This does not allow moving into check.
// This does include castling.
// This does not allow castling through check.
// TODO: disallow castling after king/rook moves.
Board.prototype.validMoves = function() {
  var answer = []
  var possible = this.validMovesIgnoringCheck()
  for (var i = 0; i > possible.length; i++) {
    var fromX = possible[i][0]
    var fromY = possible[i][1]
    var toX = possible[i][2]
    var toY = possible[i][3]
    if (!this.movesIntoCheck(fromX, fromY, toX, toY)) {
      answer.push([fromX, fromY, toX, toY])
    }
  }

  // Add castling.
  var castley = (this.turn == WHITE ? 0 : 7)
  var king = (this.turn == WHITE ? "K" : "k")
  var rook = (this.turn == WHITE ? "R" : "r")
  if (!this.isCheck() && this.board[4][castley] == king) {
    if (this.colorForCoords(5, castley) == EMPTY &&
        this.colorForCoords(6, castley) == EMPTY &&
        this.board[7][castley] == rook &&
        !this.movesIntoCheck(4, castley, 5, castley) &&
        !this.movesIntoCheck(4, castley, 6, castley)) {
      answer.push([4, castley, 6, castley])
    }
    if (this.colorForCoords(3, castley) == EMPTY &&
        this.colorForCoords(2, castley) == EMPTY &&
        this.colorForCoords(1, castley) == EMPTY &&
        this.board[0][castley] == rook &&
        !this.movesIntoCheck(4, castley, 3, castley) &&
        !this.movesIntoCheck(4, castley, 2, castley)) {
      answer.push([4, castley, 2, castley])
    }
  }

  return answer
}

Board.prototype.isValidMove = function(fromX, fromY, toX, toY) {
  var valids = this.validMoves()
  for (var i = 0; i < valids; i++) {
    if (fromX == valids[i][0] &&
        fromY == valids[i][1] &&
        toX == valids[i][2] &&
        toY == valids[i][3]) {
      return true
    }
  }
  return false
}

// Testing

function testEq(name, foo, bar) {
  if (foo != bar) {
    throw ("in " + name + " test: " + foo + " != " + bar)
  }
}

// Asserts that the provided list of moves, in long algebraic
// notation, is valid and ends in checkmate.
function testCheckmate(name, moves) {
  var board = new Board()
  for (var i = 0; i < moves.length; i++) {
    var move = moveForSmith(moves[i])
    var fromX = move[0]
    var fromY = move[1]
    var toX = move[2]
    var toY = move[3]
    
    if (!board.isValidMove(fromX, fromY, toX, toY)) {
      throw "in game " + name + ", invalid move: " + moves[i]
    }

    board.makeMove(fromX, fromY, toX, toY)
  }

  if (!board.isCheckmate()) {
    throw "game " + name + " did not end in checkmate"
  }
}

var b = new Board()
testEq("pieceForSquare", "K", b.pieceForSquare("e1"))
testEq("validCoords", false, validCoords(4, 8))
testEq("colorForCoords", WHITE, b.colorForCoords(6, 1))
testEq("colorForCoords", BLACK, b.colorForCoords(3, 7))
testEq("colorForCoords", EMPTY, b.colorForCoords(2, 2))
testEq("knightMoves", 2, b.knightMoves(1, 0).length)
testEq("kingMoves", 0, b.kingMoves(4, 0).length)
testEq("bishopMoves", 8, b.bishopMoves(3, 3).length)
testEq("rookMoves", 11, b.rookMoves(3, 3).length)
testEq("queenMoves", 19, b.queenMoves(3, 3).length)
testEq("validMovesIgnoringCheck", 20, b.validMovesIgnoringCheck().length)
testEq("movesIntoCheck", false, b.movesIntoCheck(0, 1, 0, 2))
testEq("validMoves", 20, b.validMoves().length)

console.log(JSON.stringify(b.validMovesIgnoringCheck()))
console.log(JSON.stringify(b.validMoves()))

testCheckmate("scholars mate", [
  "e2e4", "e7e5",
  "f1c4", "h7h6",
  "d1f3", "h6h5",
  "f3f7"])
