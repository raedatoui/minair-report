#!/bin/sh
react-scripts build
templ=$(<build/index.html)
echo "${templ///static/https://minair.me}" > build/index.html
gsutil cp -r build/static/js gs://minair.me
gsutil cp -r build/static/css gs://minair.me

gsutil cp build/index.html gs://minair.me
gsutil cp build/index.html gs://minair.me/fans
gsutil cp build/index.html gs://minair.me/current
gsutil cp build/index.html gs://minair.me/trends
gsutil cp build/index.html gs://minair.me/fiction
gsutil cp build/index.html gs://minair.me/songs
gsutil cp build/index.html gs://minair.me/donations
gsutil cp build/index.html gs://minair.me/minair-seminair
gsutil cp build/index.html gs://minair.me/minair-seminair-bts
gsutil cp build/index.html gs://minair.me/cock-club-initiation
gsutil cp build/index.html gs://minair.me/sal-blows-4-minair
gsutil cp build/index.html gs://minair.me/erotica-readings

gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/index.html
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/fans
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/current
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/trends
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/fiction
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/songs
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/donations
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/minair-seminair
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/minair-seminair-bts
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/cock-club-initiation
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/sal-blows-4-minair
gsutil setmeta -h "Cache-Control:no-store, max-age=0" gs://minair.me/erotica-readings



#mv build/index.html ../server/static/
#mv build/asset-manifest.json ../server/static/
#mv build/manifest.json ../server/static
#cd ../server
#gcloud -q app deploy app.yaml
