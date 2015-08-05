#!/usr/bin/python

import json
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

  images_data = []
  for suffix, scale in (("", "1x"), ("@2x", "2x"), ("@3x", "3x")):
    target_fname = name + suffix + ".png"
    images_data.append({
      "idiom": "universal",
      "scale": scale,
      "filename": target_fname,
    })
    target = target_dir + "/" + target_fname
    shutil.copyfile(source, target)

  # Create json registry
  contents = {
    "images": images_data,
    "info": {
      "version": 1,
      "author": "xcode",
    },
  }

  # Create Contents.json
  f = open(target_dir + "/Contents.json", "w")
  f.write(json.dumps(contents, indent=2))
  f.close()
