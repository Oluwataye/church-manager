
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Read the current package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found at', packageJsonPath);
    process.exit(1);
  }
  
  console.log('Reading package.json from:', packageJsonPath);
  
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  let packageJson;
  
  try {
    packageJson = JSON.parse(packageJsonContent);
  } catch (error) {
    console.error('Error parsing package.json:', error.message);
    process.exit(1);
  }

  // Add Electron-related scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "dev:electron": "concurrently -k \"cross-env NODE_ENV=development vite\" \"wait-on http://localhost:8080 && electron ./electron/main.js\"",
    "build:electron": "vite build",
    "package": "electron-builder -c electron-builder.yml",
    "package:windows": "electron-builder -c electron-builder.yml --win",
    "package:mac": "electron-builder -c electron-builder.yml --mac",
    "package:linux": "electron-builder -c electron-builder.yml --linux"
  };

  // Save the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('✅ Successfully updated package.json with Electron build scripts');
  console.log('The following scripts have been added:');
  console.log('- dev:electron: Run the app in development mode');
  console.log('- build:electron: Build the production version');
  console.log('- package: Package the app for all platforms');
  console.log('- package:windows: Package the app for Windows');
  console.log('- package:mac: Package the app for macOS');
  console.log('- package:linux: Package the app for Linux');
  
  console.log('\nNext steps:');
  console.log('1. Install required dependencies: npm install --save-dev electron electron-builder concurrently cross-env wait-on');
  console.log('2. Run npm run dev:electron to start development');
  
} catch (error) {
  console.error('❌ Error updating package.json:', error.message);
  console.error('\nIf the automatic script fails, you can manually add these scripts to your package.json:');
  console.log(`
"scripts": {
  "dev:electron": "concurrently -k \\"cross-env NODE_ENV=development vite\\" \\"wait-on http://localhost:8080 && electron ./electron/main.js\\"",
  "build:electron": "vite build",
  "package": "electron-builder -c electron-builder.yml",
  "package:windows": "electron-builder -c electron-builder.yml --win",
  "package:mac": "electron-builder -c electron-builder.yml --mac",
  "package:linux": "electron-builder -c electron-builder.yml --linux"
}
  `);
}
