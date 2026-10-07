const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const userIconPath = 'C:/Users/ZC/.gemini/antigravity/brain/ba204364-43ab-4a99-961c-9f0412c932e0/.user_uploaded/media_1791387365201.jpg';
const publicDir = path.resolve('public');
const distDir = path.resolve('dist');
const readyDir = path.resolve('ready_for_hostinger');

async function processEmblemFavicons() {
  console.log('--- Generating Favicons from 1024x1024 Emblem ---');

  // Load the 1024x1024 image
  const baseImg = sharp(userIconPath);
  
  // Save as high-res PNG
  const png512 = await sharp(userIconPath).resize(512, 512).png().toBuffer();
  const png192 = await sharp(userIconPath).resize(192, 192).png().toBuffer();
  const png180 = await sharp(userIconPath).resize(180, 180).png().toBuffer();
  const png64  = await sharp(userIconPath).resize(64, 64).png().toBuffer();
  const png48  = await sharp(userIconPath).resize(48, 48).png().toBuffer();
  const png32  = await sharp(userIconPath).resize(32, 32).png().toBuffer();
  const png16  = await sharp(userIconPath).resize(16, 16).png().toBuffer();

  const base64Png = png512.toString('base64');
  const svgFavicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Png}"/>
</svg>`;

  const files = [
    { name: 'favicon-512x512.png', buffer: png512 },
    { name: 'favicon-192x192.png', buffer: png192 },
    { name: 'apple-touch-icon.png', buffer: png180 },
    { name: 'favicon.png', buffer: png64 },
    { name: 'favicon-48x48.png', buffer: png48 },
    { name: 'favicon-32x32.png', buffer: png32 },
    { name: 'favicon-16x16.png', buffer: png16 },
    { name: 'favicon.ico', buffer: png32 },
    { name: 'favicon.svg', buffer: Buffer.from(svgFavicon.trim()) },
    { name: 'swiftorbits_emblem.jpg', buffer: fs.readFileSync(userIconPath) },
    { name: 'swiftorbits_emblem.png', buffer: png512 }
  ];

  const targetDirs = [publicDir, distDir, readyDir].filter(d => fs.existsSync(d));

  for (const f of files) {
    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, f.name), f.buffer);
    }
    console.log(`✓ ${f.name} saved to ${targetDirs.length} target directories.`);
  }

  console.log('Favicons generated successfully from new emblem!');
}

processEmblemFavicons().catch(console.error);
