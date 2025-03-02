#!/bin/bash

mkdir -p scripts

# Install svgexport globally if not already installed
if ! command -v npx svgexport &> /dev/null; then
  echo "Installing svgexport..."
  npm install -g svgexport
fi

# Convert Quick Decision icon
echo "Converting quick-decision-icon.svg to PNG..."
npx svgexport public/quick-decision-icon.svg public/quick-decision-icon.png 512:512

# Convert Deep Reflection icon
echo "Converting deep-reflection-icon.svg to PNG..."
npx svgexport public/deep-reflection-icon.svg public/deep-reflection-icon.png 512:512

echo "Conversion complete!"
echo "PNG files created:"
echo "- public/quick-decision-icon.png"
echo "- public/deep-reflection-icon.png" 