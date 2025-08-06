## Scripts

Create [scripts/update-dep.sh](../../scripts/update-dep.sh) with the following to copy a dependency from one `package.json` to another:

```bash
#!/usr/bin/env bash

# This script copies a single dependency from source-package.json to target-package.json

# Example usage:
# ./update-dep.sh package-name target-package.json
# ./update-dep.sh package-name target-package.json source-package.json dependencies
# ./update-dep.sh package-name target-package.json source-package.json devDependencies

pkg="$1"
target="$2"
source="${3:-package.json}"
section="${4:-dependencies}" # or devDependencies

version=$(jq -r --arg pkg "$pkg" '.dependencies[$pkg] // .devDependencies[$pkg]' "$source")

if [ "$version" != "null" ]; then
  jq --arg pkg "$pkg" --arg version "$version" \
      ".$section[\$pkg] = \$version" "$target" > "$target.tmp" && mv "$target.tmp" "$target"
  echo "✅ Updated $pkg@$version in $target"
else
  echo "❌ Package $pkg not found in $source"
fi
```

Create [scripts/cp-all-dep.sh](../../scripts/cp-all-dep.sh) with the following to copy all dependencies from one `package.json` to another:

```bash
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
  echo "Source or target file does not exist."
  exit 1
fi

# Read all dependencies from source and copy them to target
dependencies=$(jq -r --arg section "$section" '.[$section] | keys[]' "$source")
for pkg in $dependencies; do
  bash scripts/update-dep.sh "$pkg" "$target" "$source" "$section"
done

echo "All dependencies from $source copied to $target under section '$section'."
```

Optionally, configure each target to default to `apps/web/package.json`:

`scripts/update-dep.sh`:

```bash
target="${2:-apps/web/package.json}"
```

`scripts/update-deps.sh`:

```bash
target="${1:-apps/web/package.json}"
```

Update [package.json](../../package.json) to include these scripts:

```json
{
  "scripts": {
    "update-deps": "bash scripts/update-deps.sh"
  }
}
```

Run the script to copy all dependencies:

```bash
npm run update-deps
```
