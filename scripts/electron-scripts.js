
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
Add the following scripts to your package.json file:

"scripts": {
  "dev:electron": "concurrently -k \"cross-env NODE_ENV=development vite\" \"wait-on http://localhost:8080 && electron ./electron/main.js\"",
  "build:electron": "vite build",
  "package": "electron-builder -c electron-builder.yml",
  "package:windows": "electron-builder -c electron-builder.yml --win",
  "package:mac": "electron-builder -c electron-builder.yml --mac",
  "package:linux": "electron-builder -c electron-builder.yml --linux"
}

Make sure you have these dependencies installed:
npm install --save-dev electron electron-builder concurrently cross-env wait-on

Then you can run:
- npm run dev:electron - to start the development version
- npm run build:electron - to build the production version
- npm run package - to create installers for all platforms
- npm run package:windows - to create Windows installer specifically
`);
