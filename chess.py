#!/usr/bin/python
import random
import sys
import time

"""
The square like (2, 2) from the name like c3.
"""
def square_from_name(name):
  if len(name) != 2:
    raise ValueError, ("%s should be 2 characters long" % name)
  x = ord(name[0]) - ord("a")
  if x < 0 or x > 7:
    raise ValueError, "first char invalid: %s" % name[0]
  y = ord(name[1]) - ord("1")
  if y < 0 or y > 7:
    raise ValueError, "second char invalid: %s" % name[1]
  return (x, y)

"""
The name like g6 from the square like (6, 7).
"""
def name_from_square(square):
  x, y = square
  return chr(ord("a") + x) + chr(ord("1") + y)

"""
Returns a color string, either 'white' or 'black', for the square.
"""
def color(square):
  x, y = square
  if (x + y) % 2:
    return 'white'
  return 'black'

"""
Prints a blank board.
"""
def print_blank_board():
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
  
"""
Returns a random square in a format like (4, 5).

Can take a config string like bk, bq, wk, wq to define a quarter of the board.

"""
def random_square(square_config=None):
  x = random.randint(0, 7)
  y = random.randint(0, 7)
  if square_config is not None:
    color, side = square_config
    if color == "b":
      y = random.randint(4, 7)
    elif color == "w":
      y = random.randint(0, 3)
    if side == "k":
      x = random.randint(4, 7)
    elif side == "q":
      x = random.randint(0, 3)
  return x, y

"""
Runs a quiz given the particular one-round function.
The function should return 0 or 1 for success.
Returns (bool-for-was-it-perfect, average-time)
"""
def quiz(one_round, num_rounds):
  score = 0
  start = time.time()
  for _ in range(num_rounds):
    score += one_round()
  end = time.time()
  duration = end - start
  perfect = score == num_rounds
  print "You scored %d / %d = %d%%." % (score, num_rounds,
                                        int(100.0 * score / num_rounds))
  avg_time = duration / num_rounds
  print "You spent %.2fs per question." % (duration / num_rounds)
  print
  return (perfect, avg_time)

"""
Finds the 'brother square' for the given square.
"""
def brother(square):
  x, y = square
  return (7 - x, 7 - y)

"""
Sends a congratulations message where 0.5 is perfect and 3 is good for
someone just getting started.
"""
def congratulate(avg_time):
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
  
"""
Asks the user to hit enter to continue and then clears.
"""
def pause_and_clear():
  print "Hit enter to continue."
  sys.stdin.readline()
  print "\n" * 100
  
