
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

let mainWindow;
let apiServer;
let apiProcess;

// Initialize the database
const initDatabase = () => {
  // Create db.json file if it doesn't exist
  const dbPath = path.join(app.getPath('userData'), 'db.json');
  const adapter = new JSONFile(dbPath);
  const db = new Low(adapter);
  
  return { db, dbPath };
};

// Start Express API server
const startApiServer = () => {
  const { db, dbPath } = initDatabase();
  
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(express.json());
  
  // Initialize database with default data if empty
  apiApp.get('/api/init', async (req, res) => {
    await db.read();
    db.data = db.data || { 
      members: [],
      incomes: [],
      attendance_records: [],
      events: [],
      groups: [],
      announcements: [],
      church_settings: [{
        id: '1',
        church_name: 'Local Faith Community Church',
        logo_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }],
      users: [{
        email: 'admin@lfcc.com',
        password: 'admin123',
        role: 'admin'
      }]
    };
    await db.write();
    res.json({ success: true, dbPath });
  });
  
  // Members API
  apiApp.get('/api/members', async (req, res) => {
    await db.read();
    res.json(db.data.members || []);
  });
  
  apiApp.post('/api/members', async (req, res) => {
    await db.read();
    const newMember = { 
      ...req.body, 
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.data.members = db.data.members || [];
    db.data.members.push(newMember);
    await db.write();
    res.json(newMember);
  });
  
  apiApp.put('/api/members/:id', async (req, res) => {
    await db.read();
    const id = req.params.id;
    const memberIndex = db.data.members.findIndex(m => m.id === id);
    
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    db.data.members[memberIndex] = { 
      ...db.data.members[memberIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    await db.write();
    res.json(db.data.members[memberIndex]);
  });
  
  apiApp.delete('/api/members/:id', async (req, res) => {
    await db.read();
    const id = req.params.id;
    db.data.members = db.data.members.filter(m => m.id !== id);
    await db.write();
    res.json({ success: true });
  });
  
  // Incomes API
  apiApp.get('/api/incomes', async (req, res) => {
    await db.read();
    res.json(db.data.incomes || []);
  });
  
  apiApp.post('/api/incomes', async (req, res) => {
    await db.read();
    const newIncome = { 
      ...req.body, 
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.data.incomes = db.data.incomes || [];
    db.data.incomes.push(newIncome);
    await db.write();
    res.json(newIncome);
  });
  
  // Authentication API
  apiApp.post('/api/auth/login', async (req, res) => {
    await db.read();
    const { email, password } = req.body;
    
    const user = (db.data.users || []).find(
      u => u.email === email && u.password === password
    );
    
    if (user) {
      res.json({ 
        user: { 
          email: user.email, 
          role: user.role 
        }, 
        success: true 
      });
    } else {
      res.status(401).json({ 
        error: 'Invalid credentials', 
        success: false 
      });
    }
  });
  
  apiApp.post('/api/auth/register', async (req, res) => {
    await db.read();
    const { email, password } = req.body;
    
    db.data.users = db.data.users || [];
    const exists = db.data.users.some(u => u.email === email);
    
    if (exists) {
      return res.status(400).json({ 
        error: 'User already exists', 
        success: false 
      });
    }
    
    const isFirstUser = db.data.users.length === 1 && 
                         db.data.users[0].email === 'admin@lfcc.com';
    
    const newUser = {
      email,
      password,
      role: isFirstUser ? 'admin' : 'user'
    };
    
    db.data.users.push(newUser);
    await db.write();
    
    res.json({ 
      user: { 
        email: newUser.email, 
        role: newUser.role 
      }, 
      success: true 
    });
  });
  
  // Start the server
  const port = process.env.API_PORT || 3030;
  apiServer = apiApp.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
};

function createWindow() {
  startApiServer();
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/android-chrome-512x512.png')
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:8080' // Vite dev server
    : `file://${path.join(__dirname, '../dist/index.html')}`; // Production build
    
  mainWindow.loadURL(startUrl);
  
  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  
  if (apiServer) {
    apiServer.close();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', () => {
  if (apiServer) {
    apiServer.close();
  }
});
