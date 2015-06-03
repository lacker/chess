#!/usr/bin/python
"""
A quiz to see if you can name brother squares.

Phase 2 of Rensch blindfold training.
"""
import chess
import sys

"""
Does one round of the quiz. Returns your score, 0 or 1.
"""
def one_round():
  square = chess.random_square()
  brother = chess.brother(square)
  name = chess.name_from_square(square)
  brother_name = chess.name_from_square(brother)
  print "What is the brother of %s?" % name
  answer = ""
  while len(answer) != 2:
    answer = sys.stdin.readline().strip().lower()
  if answer == brother_name:
    print "Correct!"
    print
    return 1
  print "No. The brother of %s is %s." % (name, brother_name)
  chess.print_blank_board()
  chess.pause_and_clear()
  return 0

"""
Does the whole quiz.
"""
def main():
  while True:
    perfect, avg_time = chess.quiz(one_round, 20)
    if perfect:
      chess.congratulate(avg_time)
    chess.pause_and_clear()

if __name__ == "__main__":
  main()
