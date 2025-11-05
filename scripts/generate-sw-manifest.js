#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist/public');
const assetsDir = path.join(distDir, 'assets');

function getAllAssets() {
  const assets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
  ];

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    files.forEach((file) => {
      if (/\.(js|css|woff|woff2|png|svg|jpg|jpeg|webp|ico)$/i.test(file)) {
        assets.push(`/assets/${file}`);
      }
    });
  }

  return assets;
}

function generateManifest() {
  try {
    const assets = getAllAssets();
    const manifest = {
      assets,
      timestamp: new Date().toISOString(),
      version: 'voidlock-v2.1.1'
    };

    const manifestPath = path.join(distDir, 'sw-assets.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`✅ Generated sw-assets.json with ${assets.length} assets`);
    console.log(`   Location: ${manifestPath}`);
  } catch (error) {
    console.error('❌ Failed to generate service worker manifest:', error);
    process.exit(1);
  }
}

generateManifest();
