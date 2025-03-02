const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

/**
 * SVG to PNG Converter
 * 
 * This script converts SVG files to PNG format using the canvas library.
 * It reads SVG files from the public directory, renders them to a canvas,
 * and saves the result as PNG files.
 * 
 * Usage:
 * - Run this script directly with Node.js
 * - The script will process the SVG files defined in the main function
 * - Default output size is 192x192 pixels but can be customized
 * 
 * Dependencies:
 * - fs: For file system operations
 * - path: For handling file paths
 * - canvas: For rendering SVGs and creating PNGs
 */

async function convertSvgToPng(svgPath, pngPath, size = 192) {
  try {
    // Create a canvas with the desired dimensions
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Read the SVG file
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create a data URL from the SVG content
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // Load the SVG as an image
    const img = await loadImage(svgDataUrl);
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, size, size);
    
    // Write the PNG file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);
    
    console.log(`Converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath} to PNG:`, error);
  }
}

// Convert the icons
(async () => {
  const publicDir = path.join(__dirname, '../public');
  
  await convertSvgToPng(
    path.join(publicDir, 'your-icon.svg'),
    path.join(publicDir, 'your-icon.png')
  );
  
  await convertSvgToPng(
    path.join(publicDir, 'quick-decision-icon.svg'),
    path.join(publicDir, 'quick-decision-icon.png')
  );
})(); 