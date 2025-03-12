
console.log(`
Add the following scripts to your package.json file:

"scripts": {
  "dev:electron": "concurrently -k \"cross-env NODE_ENV=development vite\" \"wait-on http://localhost:8080 && electron electron/main.js\"",
  "build:electron": "vite build && electron-builder",
  "package": "electron-builder --dir",
  "make": "electron-builder"
}

Then you can run:
- npm run dev:electron - to start the development version
- npm run build:electron - to build the production version
- npm run make - to create installers
`);
