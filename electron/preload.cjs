
'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// Expose the Electron API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Flag to identify as Electron
  isElectron: true,
  
  // API base URL for the local server
  apiBaseUrl: 'http://localhost:3000',
  
  // File upload handler
  uploadFile: (options) => ipcRenderer.invoke('upload-file', options),
  
  // Get the app version
  getAppVersion: () => process.env.npm_package_version || '1.0.0'
});
