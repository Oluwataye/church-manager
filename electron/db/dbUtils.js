
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

// Get user data path for database storage
const getUserDataPath = (app) => {
  const userDataPath = app.getPath('userData');
  return userDataPath;
};

// Ensure the database directory exists
const initializeDbDirectory = (app) => {
  const dbDirectory = path.join(getUserDataPath(app), 'db');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }
  return dbDirectory;
};

// Create or get the database file path
const getDbFilePath = (app, dbName) => {
  const dbDirectory = initializeDbDirectory(app);
  return path.join(dbDirectory, `${dbName}.json`);
};

// Initialize a database with default data structure
const initializeDb = (app, dbName) => {
  const file = getDbFilePath(app, dbName);
  const adapter = new JSONFile(file);
  
  // Create default data structure based on database name
  // This addresses the "lowdb: missing default data" error
  let defaultData = {};
  switch (dbName) {
    case 'users':
      defaultData = { users: [] };
      break;
    case 'members':
      defaultData = { members: [] };
      break;
    case 'income':
      defaultData = { income: [] };
      break;
    case 'attendance':
      defaultData = { attendance: [] };
      break;
    case 'events':
      defaultData = { events: [] };
      break;
    case 'groups':
      defaultData = { groups: [] };
      break;
    case 'settings':
      defaultData = { settings: {} };
      break;
    default:
      defaultData = {};
  }
  
  const db = new Low(adapter, defaultData);
  return db;
};

module.exports = {
  getUserDataPath,
  initializeDbDirectory,
  getDbFilePath,
  initializeDb
};
