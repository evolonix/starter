#!/usr/bin/env bash

# This script copies a single dependency from source-package.json to target-package.json

# Example usage:
# ./update-dep.sh package-name
# ./update-dep.sh package-name target-package.json
# ./update-dep.sh package-name target-package.json source-package.json dependencies
# ./update-dep.sh package-name target-package.json source-package.json devDependencies

pkg="$1"
target="${2:-apps/web/package.json}"
source="${3:-package.json}"
section="${4:-dependencies}" # or devDependencies

sourceVersion=$(jq -r --arg pkg "$pkg" '.dependencies[$pkg] // .devDependencies[$pkg]' "$source")
targetVersion=$(jq -r --arg pkg "$pkg" '.dependencies[$pkg] // .devDependencies[$pkg]' "$target")

if [ "$sourceVersion" != "null" ]; then
  # Add or update the package in the target
  jq --arg pkg "$pkg" --arg version "$sourceVersion" \
      ".$section[\$pkg] = \$version" "$target" > "$target.tmp" && mv "$target.tmp" "$target"
  echo "✅ Updated $pkg@$sourceVersion in $target"
elif [ "$targetVersion" != "null" ]; then
  # Remove the package from the target
  jq --arg pkg "$pkg" "del(.$section[\$pkg])" "$target" > "$target.tmp" && mv "$target.tmp" "$target"
else
  echo "❌ Package $pkg not found in $source"
fi
