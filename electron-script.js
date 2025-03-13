
const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add Electron-related scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "dev:electron": "concurrently -k \"cross-env NODE_ENV=development vite\" \"wait-on http://localhost:8080 && electron electron/main.js\"",
  "build:electron": "vite build",
  "package": "electron-builder -c electron-builder.yml",
  "package:windows": "electron-builder -c electron-builder.yml --win",
  "package:mac": "electron-builder -c electron-builder.yml --mac",
  "package:linux": "electron-builder -c electron-builder.yml --linux"
};

// Save the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('package.json updated with Electron build scripts');
