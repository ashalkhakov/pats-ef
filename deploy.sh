#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

echo Initializing repo

git init
git config user.name "Artyom Shalkhakov"
git config user.email "artyom.shalkhakov@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/ashalkhakov/pats-ef.git"
git fetch upstream
git reset upstream/gh-pages

# node.js package 'touch' interferes with this...
/bin/touch .

echo Committing to GH Pages

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages

echo Pushed to GH Pages
