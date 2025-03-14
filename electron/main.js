
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { startServer, setApp } = require('./server');

// Port for the local API server
const API_PORT = 3000;

// Set the electron app in the server module
setApp(app);

// Start the local API server
startServer(API_PORT);

// Keep a global reference of the window object
let mainWindow;

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  // Load the app
  if (app.isPackaged) {
    // In production, load the bundled app
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  } else {
    // In development, load from the dev server
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle file uploads
ipcMain.handle('upload-file', async (event, { fileType }) => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }
      ]
    });

    if (canceled || filePaths.length === 0) {
      return { success: false, message: 'No file selected' };
    }

    const filePath = filePaths[0];
    const fileName = path.basename(filePath);
    
    // Get the app's user data directory for storing uploads
    const userDataPath = app.getPath('userData');
    const uploadsDir = path.join(userDataPath, 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate a unique filename
    const fileExt = path.extname(fileName);
    const uniqueFileName = `${Date.now()}${fileExt}`;
    const destinationPath = path.join(uploadsDir, uniqueFileName);
    
    // Copy the file to the uploads directory
    fs.copyFileSync(filePath, destinationPath);
    
    // Return the local file URL
    const fileUrl = `file://${destinationPath}`;
    
    return {
      success: true,
      file: {
        name: fileName,
        path: destinationPath,
        url: fileUrl
      }
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, message: error.message };
  }
});
