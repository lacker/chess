#!/usr/bin/python

import os

images = os.path.join(*(os.path.split(__file__)[:-1] + ("images",)))

for image in os.listdir(images):
  fname = os.path.join(images, image)
  print fname
