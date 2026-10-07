const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const userImgPath = 'C:/Users/ZC/.gemini/antigravity/brain/ba204364-43ab-4a99-961c-9f0412c932e0/.user_uploaded/media_1791382639008.png';
const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

async function generateAllFavicons() {
  console.log('--- Generating Production Favicons ---');

  // 1. Copy original brand banner to public & dist
  fs.copyFileSync(userImgPath, path.join(publicDir, 'swiftorbits_logo.png'));
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(userImgPath, path.join(distDir, 'swiftorbits_logo.png'));
  }

  // 2. Crop parts:
  const swiftCrop = await sharp(userImgPath)
    .extract({ left: 4, top: 16, width: 112, height: 42 })
    .toBuffer();

  const orbitsUsaCrop = await sharp(userImgPath)
    .extract({ left: 117, top: 16, width: 198, height: 42 })
    .toBuffer();

  const size = 512;
  const bgNavy = { r: 5, g: 6, b: 56, alpha: 255 };

  const swiftResized = await sharp(swiftCrop).resize({ width: 335 }).toBuffer();
  const orbitsResized = await sharp(orbitsUsaCrop).resize({ width: 445 }).toBuffer();

  const swiftMeta = await sharp(swiftResized).metadata();
  const orbitsMeta = await sharp(orbitsResized).metadata();

  const totalContentHeight = swiftMeta.height + 28 + orbitsMeta.height;
  const startY = Math.round((size - totalContentHeight) / 2);

  // Rounded squircle background for Apple/Google style icons
  const rectSvg = Buffer.from(
    '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="512" height="512" rx="96" fill="#050638"/>' +
    '<rect width="504" height="504" x="4" y="4" rx="92" fill="none" stroke="#2563eb" stroke-width="4" opacity="0.3"/>' +
    '</svg>'
  );

  const master512 = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
  .composite([
    { input: rectSvg, top: 0, left: 0 },
    { input: swiftResized, top: startY, left: 38 },
    { input: orbitsResized, top: startY + swiftMeta.height + 28, left: 34 }
  ])
  .png()
  .toBuffer();

  // Solid square background version for standard ICO
  const masterSquare512 = await sharp({
    create: { width: size, height: size, channels: 4, background: bgNavy }
  })
  .composite([
    { input: swiftResized, top: startY, left: 38 },
    { input: orbitsResized, top: startY + swiftMeta.height + 28, left: 34 }
  ])
  .png()
  .toBuffer();

  // Targets
  const targetDirs = [publicDir];
  if (fs.existsSync(distDir)) targetDirs.push(distDir);

  const iconSizes = [
    { name: 'favicon-512x512.png', size: 512, buffer: master512 },
    { name: 'favicon-192x192.png', size: 192, buffer: master512 },
    { name: 'apple-touch-icon.png', size: 180, buffer: master512 },
    { name: 'favicon-48x48.png', size: 48, buffer: masterSquare512 },
    { name: 'favicon-32x32.png', size: 32, buffer: masterSquare512 },
    { name: 'favicon-16x16.png', size: 16, buffer: masterSquare512 },
    { name: 'favicon.png', size: 64, buffer: master512 }
  ];

  for (const s of iconSizes) {
    const resized = await sharp(s.buffer).resize(s.size, s.size).png().toBuffer();
    for (const d of targetDirs) {
      fs.writeFileSync(path.join(d, s.name), resized);
    }
    console.log(`✓ ${s.name} (${s.size}x${s.size})`);
  }

  // Favicon.ico
  const ico32 = await sharp(masterSquare512).resize(32, 32).png().toBuffer();
  for (const d of targetDirs) {
    fs.writeFileSync(path.join(d, 'favicon.ico'), ico32);
  }
  console.log('✓ favicon.ico (32x32)');

  // Favicon.svg embedding the high-res 512x512 image
  const base64Png = master512.toString('base64');
  const svgFavicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Png}"/>
</svg>`;

  for (const d of targetDirs) {
    fs.writeFileSync(path.join(d, 'favicon.svg'), svgFavicon.trim());
  }
  console.log('✓ favicon.svg (512x512 base64)');

  console.log('All favicons generated and synced to public & dist!');
}

generateAllFavicons().catch(console.error);
