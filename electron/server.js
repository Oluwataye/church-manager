
const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// Create express app
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

// Get user data path for database storage
const getUserDataPath = () => {
  const userDataPath = app.getPath('userData');
  return userDataPath;
};

// Ensure the database directory exists
const initializeDbDirectory = () => {
  const dbDirectory = path.join(getUserDataPath(), 'db');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }
  return dbDirectory;
};

// Create or get the database file path
const getDbFilePath = (dbName) => {
  const dbDirectory = initializeDbDirectory();
  return path.join(dbDirectory, `${dbName}.json`);
};

// Initialize a database
const initializeDb = (dbName) => {
  const file = getDbFilePath(dbName);
  const adapter = new JSONFile(file);
  const db = new Low(adapter);
  return db;
};

// Initialize database structure if it doesn't exist
const initializeDatabases = async () => {
  console.log('Initializing databases...');
  
  // Users database
  const usersDb = initializeDb('users');
  await usersDb.read();
  usersDb.data ||= { users: [] };
  
  // Check if we need to create an admin user
  if (usersDb.data.users.length === 0) {
    usersDb.data.users.push({
      id: '1',
      email: 'admin@lfcc.com',
      password: 'admin123', // In a real app, this would be hashed
      role: 'admin',
      created_at: new Date().toISOString()
    });
    await usersDb.write();
  }
  
  // Members database
  const membersDb = initializeDb('members');
  await membersDb.read();
  membersDb.data ||= { members: [] };
  await membersDb.write();
  
  // Income database
  const incomeDb = initializeDb('income');
  await incomeDb.read();
  incomeDb.data ||= { income: [] };
  await incomeDb.write();
  
  // Attendance database
  const attendanceDb = initializeDb('attendance');
  await attendanceDb.read();
  attendanceDb.data ||= { attendance: [] };
  await attendanceDb.write();

  // Events database
  const eventsDb = initializeDb('events');
  await eventsDb.read();
  eventsDb.data ||= { events: [] };
  await eventsDb.write();

  // Groups database
  const groupsDb = initializeDb('groups');
  await groupsDb.read();
  groupsDb.data ||= { groups: [] };
  await groupsDb.write();

  // Settings database
  const settingsDb = initializeDb('settings');
  await settingsDb.read();
  settingsDb.data ||= { settings: {
    church_name: 'Living Faith Church Chanchaga',
    logo_url: null
  }};
  await settingsDb.write();
  
  console.log('Databases initialized successfully');
};

// Auth routes
expressApp.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersDb = initializeDb('users');
    await usersDb.read();
    
    const user = usersDb.data.users.find(u => 
      u.email === email && u.password === password
    );
    
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }
      });
    } else {
      return res.json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
});

expressApp.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersDb = initializeDb('users');
    await usersDb.read();
    
    // Check if user already exists
    const existingUser = usersDb.data.users.find(u => u.email === email);
    if (existingUser) {
      return res.json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this would be hashed
      role: 'user',
      created_at: new Date().toISOString()
    };
    
    usersDb.data.users.push(newUser);
    await usersDb.write();
    
    return res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
});

// Members routes
expressApp.get('/members', async (req, res) => {
  try {
    const membersDb = initializeDb('members');
    await membersDb.read();
    return res.json(membersDb.data.members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return res.status(500).json([]);
  }
});

expressApp.post('/members', async (req, res) => {
  try {
    const member = req.body;
    const membersDb = initializeDb('members');
    await membersDb.read();
    
    // Add id and timestamps
    const newMember = {
      ...member,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    membersDb.data.members.push(newMember);
    await membersDb.write();
    return res.json(newMember);
  } catch (error) {
    console.error('Error adding member:', error);
    return res.status(500).json({ error: 'Failed to add member' });
  }
});

// Income routes
expressApp.get('/income', async (req, res) => {
  try {
    const incomeDb = initializeDb('income');
    await incomeDb.read();
    return res.json(incomeDb.data.income);
  } catch (error) {
    console.error('Error fetching income:', error);
    return res.status(500).json([]);
  }
});

expressApp.post('/income', async (req, res) => {
  try {
    const income = req.body;
    const incomeDb = initializeDb('income');
    await incomeDb.read();
    
    // Add id and timestamps
    const newIncome = {
      ...income,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    incomeDb.data.income.push(newIncome);
    await incomeDb.write();
    return res.json(newIncome);
  } catch (error) {
    console.error('Error adding income:', error);
    return res.status(500).json({ error: 'Failed to add income' });
  }
});

// Settings routes
expressApp.get('/settings', async (req, res) => {
  try {
    const settingsDb = initializeDb('settings');
    await settingsDb.read();
    return res.json(settingsDb.data.settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

expressApp.post('/settings', async (req, res) => {
  try {
    const settings = req.body;
    const settingsDb = initializeDb('settings');
    await settingsDb.read();
    
    // Update settings
    settingsDb.data.settings = {
      ...settingsDb.data.settings,
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    await settingsDb.write();
    return res.json(settingsDb.data.settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Initialize the API server
const startServer = async (port) => {
  try {
    // Initialize the databases
    await initializeDatabases();
    
    // Start the server
    expressApp.listen(port, () => {
      console.log(`Local API server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
  }
};

module.exports = { startServer };
