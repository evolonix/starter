#!/usr/bin/env bash

ignore_files=".git|.nx|node_modules|README.md|customize.sh|customize.json"

for input_file in `tree -I "${ignore_files}" -Ffai --noreport`
do
  if [ ! -d "${input_file}" ]; then
    echo "Processing file: ${input_file}"
    gomplate \
         -f "${input_file}" \
         -o "${input_file}" \
         --left-delim "~[" \
         --right-delim "]~" \
         -c starter=./customize.json # Example template placeholder value: ~[ .starter.foo ]~
  fi
done

# Clean up / implode
rm README.md
mv README_TEMPLATE.md README.md
mv github .github
rm customize.sh
rm customize.json
