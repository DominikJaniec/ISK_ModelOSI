#!/bin/sh

cd osi
npm install
ng build --target=production --output-path="../publish" --base-href="./"

echo ""
echo "Published into folder:"
cd ../publish
pwd
ls -ls
