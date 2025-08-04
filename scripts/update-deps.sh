#!/usr/bin/env bash

# This script copies all dependencies from source-package.json to target-package.json

# Example usage:
# ./update-deps.sh
# ./update-deps.sh target-package.json
# ./update-deps.sh target-package.json source-package.json dependencies
# ./update-deps.sh target-package.json source-package.json devDependencies

target="${1:-apps/web/package.json}"
source="${2:-package.json}"
section="${3:-dependencies}" # or devDependencies

if [ -z "$source" ] || [ -z "$target" ]; then
  echo "Usage: $0 <source-package.json> <target-package.json> [section]"
  exit 1
fi
if [ ! -f "$source" ] || [ ! -f "$target" ]; then
  echo "⚠️ Source or target file does not exist."
  exit 1
fi

# Read all dependencies from source and copy them to target
dependencies=$(jq -r --arg section "$section" '.[$section] | keys[]' "$source")
for pkg in $dependencies; do
  bash scripts/update-dep.sh "$pkg" "$target" "$source" "$section"
done

# Read all dependencies from target and remove them if not in source
targetDependencies=$(jq -r --arg section "$section" '.[$section] | keys[]' "$target")
for pkg in $targetDependencies; do
  if ! jq -e --arg pkg "$pkg" --arg section "$section" '.[$section][$pkg]?' "$source" > /dev/null; then
    bash scripts/update-dep.sh "$pkg" "$target" "$source" "$section"
  fi
done

echo "✅ All dependencies from $source copied to $target under section '$section'."
