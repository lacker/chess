#!/usr/bin/python

import shutil
import os

base_dir = os.path.join(*os.path.split(__file__)[:-1])
images = base_dir + "/images"

for image in os.listdir(images):
  # Strip off the .png
  name = image.split(".")[0]

  # The source picture
  source = os.path.join(images, image)

  # Check if the destination dir exists
  target_dir = "%s/iOS/Images.xcassets/%s.imageset" % (base_dir, name)
  if os.path.exists(target_dir):
    print target_dir, "already exists"
    continue

  print target_dir, "does not exist. creating it..."
  os.mkdir(target_dir)

  for suffix in ("", "@2x", "@3x"):
    target_fname = name + suffix + ".png"
    target = target_dir + "/" + target_fname
    shutil.copyfile(source, target)
    # TODO: create json registry
