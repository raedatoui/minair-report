#!/bin/sh
set -eu
react-scripts build
node -e 'const fs = require("node:fs"); const file = "build/index.html"; fs.writeFileSync(file, fs.readFileSync(file, "utf8").replaceAll("/static/", "https://www.minair.me/static/"));'
