var board = require('../board');
var Board = board.Board;

describe('basic board', () => {
  it('basic moves', () => {
    var b = new Board();
    expect(b.pieceForSquare('e1')).toEqual('K');
  });
});
