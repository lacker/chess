#!/usr/bin/python

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
    print target_dir, "exists"
  else:
    print target_dir, "does not exist"
