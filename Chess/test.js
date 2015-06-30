#!/usr/bin/env babel-node

const board = require("./board.js")
const Board = board.Board

// Testing

function testEq(name, foo, bar) {
  if (foo != bar) {
    throw ("in " + name + " test: " + foo + " != " + bar)
  }
}


var b = new Board()
testEq("pieceForSquare", "K", b.pieceForSquare("e1"))
testEq("colorForCoords", board.WHITE, b.colorForCoords(6, 1))
testEq("colorForCoords", board.BLACK, b.colorForCoords(3, 7))
testEq("colorForCoords", board.EMPTY, b.colorForCoords(2, 2))
testEq("knightMoves", 2, b.knightMoves(1, 0).length)
testEq("kingMoves", 0, b.kingMoves(4, 0).length)
testEq("bishopMoves", 8, b.bishopMoves(3, 3).length)
testEq("rookMoves", 11, b.rookMoves(3, 3).length)
testEq("queenMoves", 19, b.queenMoves(3, 3).length)
testEq("validMovesIgnoringCheck", 20, b.validMovesIgnoringCheck().length)
testEq("movesIntoCheck", false, b.movesIntoCheck(0, 1, 0, 2))
testEq("validMoves", 20, b.validMoves().length)
testEq("isValidMove", true, b.isValidMove(0, 1, 0, 3))

board.testCheckmate("scholars mate", [
  "e2e4", "e7e5",
  "f1c4", "h7h6",
  "d1f3", "h6h5",
  "f3f7"])

board.testCheckmate("fools mate", [
  "f2f4", "e7e5",
  "g2g4", "d8h4"])

board.testCheckmate("kingside castling", [
  "e2e4", "e7e5",
  "f1c4", "f8c5",
  "d2d3", "g8f6",
  "d1g4", "e8g8",
  "c1h6", "a7a5",
  "g4g7"])

board.testCheckmate("en passant", [
  "e2e3", "e7e5",
  "f1c4", "e5e4",
  "d2d4", "e4d3",
  "d1f3", "a7a5",
  "f3f7"])

board.newBoard("queenside castling", [
  "d2d4", "d7d5",
  "d1d3", "d8d6",
  "c1d2", "c8d7",
  "b1c3", "b8c6",
  "e1c1", "e8c8"])
