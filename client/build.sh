#!/bin/sh
react-scripts build
templ=$(<build/index.html)
echo "${templ///static/https://storage.googleapis.com/api-project-992432653598.appspot.com}" > build/index.html
gsutil cp -r build/static/js gs://api-project-992432653598.appspot.com
gsutil cp -r build/static/css gs://api-project-992432653598.appspot.com
gsutil cp build/index.html gs://api-project-992432653598.appspot.com
mv build/index.html ../server/static/
mv build/asset-manifest.json ../server/static/