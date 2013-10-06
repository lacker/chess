#!/usr/bin/python
"""
A quiz to see if you know what the colors are for squares on the chessboard.

Phase 1 of Rensch blindfold training.
"""
import chess
import sys

"""
Does one round of the quiz. Returns your score, 0 or 1.

square_config can be bk, bq, wk, wq or none to indicate what area of the
board to quiz from.
"""
def one_round(square_config):
  square = chess.random_square(square_config)
  name = chess.name_from_square(square)
  color = chess.color(square)
  print "What color is %s?" % name
  answer = ""
  while len(answer) == 0:
    answer = sys.stdin.readline().strip().lower()
  if answer[0] == color[0]:
    print "Correct!"
    print
    return 1
  print "No. %s is %s." % (name, color)
  chess.print_blank_board()
  chess.pause_and_clear()
  return 0

"""
Does the whole quiz.
"""
def main():
  square_config = None
  if len(sys.argv) == 2:
    square_config = sys.argv[1]
  
  while True:
    perfect, avg_time = chess.quiz(lambda: one_round(square_config), 20)
    if perfect:
      chess.congratulate(avg_time)
    chess.pause_and_clear()

if __name__ == "__main__":
  main()
