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
Returns a random square in a format like (4, 5).
"""
def random_square():
  return (random.randint(0, 7), random.randint(0, 7))

"""
Runs a quiz given the particular one-round function.
The function should return 0 or 1 for success.
"""
def quiz(one_round, num_rounds):
  score = 0
  start = time.time()
  for _ in range(num_rounds):
    score += one_round()
  end = time.time()
  duration = end - start
  print "You scored %d / %d = %d%%." % (score, num_rounds,
                                        int(100.0 * score / num_rounds))
  print "You spent %.2fs per question." % (duration / num_rounds)
  print

"""
Asks the user to hit enter to continue and then clears.
"""
def pause_and_clear():
  print "Hit enter to continue."
  sys.stdin.readline()
  print "\n" * 100
  
