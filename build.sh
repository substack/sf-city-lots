#!/bin/bash
curl -O http://gispubweb.sfgov.org/website/sfshare/catalog/citylots.zip
./node_modules/.bin/shp2json citylots.zip citylots.json
node extents.js > extents.json
node render.js
