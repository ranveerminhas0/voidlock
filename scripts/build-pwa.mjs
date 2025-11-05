#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔨 Building VoidLock with offline support...\n');

// Step 1: Run normal build
console.log('📦 Step 1/2: Running vite build...');
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Build failed with code ${code}`);
    process.exit(code);
  }

  console.log('\n✅ Vite build complete');
  console.log('\n📝 Step 2/2: Generating service worker asset manifest...');

  // Step 2: Generate service worker manifest
  try {
    const distDir = path.resolve(__dirname, '../dist/public');
    const assetsDir = path.join(distDir, 'assets');
    
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

    const manifest = {
      assets,
      timestamp: new Date().toISOString(),
      version: 'voidlock-v2.1.1'
    };

    const manifestPath = path.join(distDir, 'sw-assets.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`✅ Generated sw-assets.json with ${assets.length} assets`);
    console.log(`   Location: ${manifestPath}\n`);
    console.log('🎉 Build complete! Your app is ready for offline deployment.\n');
    console.log('📋 Next steps:');
    console.log('   • Deploy the dist/ folder to any static host');
    console.log('   • App will work 100% offline after first load');
    console.log('   • No backend required!\n');
  } catch (error) {
    console.error('❌ Failed to generate service worker manifest:', error);
    process.exit(1);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Failed to start build process:', error);
  process.exit(1);
});
