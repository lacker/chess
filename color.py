#!/usr/bin/python
"""
A quiz to see if you know what the colors are for squares on the chessboard.

Phase 1 of Rensch blindfold training.
"""
import chess
import sys

"""
Does one round of the quiz. Returns your score, 0 or 1.
"""
def one_round():
  square = chess.random_square()
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
  board = """
- # - # - # - # 
# - # - # - # - 
- # - # - # - # 
# - # - # - # - 
- # - # - # - # 
# - # - # - # - 
- # - # - # - # 
# - # - # - # -
  """
  board = board.replace("#", u"\u25a0")
  board = board.replace("-", u"\u25a1")
  print board
  chess.pause_and_clear()
  return 0

"""
Does the whole quiz.
"""
def main():
  while True:
    perfect, avg_time = chess.quiz(one_round, 20)
    if perfect:
      if avg_time < 0.5:
        print "Your mind is like a hash table. You have achieved nirvana."
      elif avg_time < 1.0:
        print "Good work. You may rest and advance."
      elif avg_time < 1.5:
        print "You are halfway to perfection."
      elif avg_time < 2.0:
        print "Your skills are significant."
      elif avg_time < 2.5:
        print "Your practice is paying off."
      elif avg_time < 3.0:
        print "Your effort is nontrivial."
      else:
        print "You did not fail."
      print
    chess.pause_and_clear()

if __name__ == "__main__":
  main()
