#!/bin/sh
react-scripts build
templ=$(<build/index.html)
echo "${templ///static/https://www.minair.me/static}" > build/index.html
