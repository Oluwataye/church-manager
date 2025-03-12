
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3030/api' 
    : 'http://localhost:3030/api'
});
