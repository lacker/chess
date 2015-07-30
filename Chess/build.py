#!/usr/bin/python

import os

base_dir = os.path.join(*os.path.split(__file__)[:-1])
images = base_dir + "/images"

for image in os.listdir(images):
  # Strip off the .png
  base = image.split(".")[0]

  # The source picture
  fname = os.path.join(images, image)
  print fname

  # Check if the destination dir exists
  target_dir = os.path.join
