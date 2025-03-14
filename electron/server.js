
const express = require('express');
const cors = require('cors');
const { initializeDatabases } = require('./db/dbInit');
const { setupAuthRoutes } = require('./routes/authRoutes');
const { setupMemberRoutes } = require('./routes/memberRoutes');
const { setupIncomeRoutes } = require('./routes/incomeRoutes');
const { setupSettingsRoutes } = require('./routes/settingsRoutes');

// Create express app
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

// Initialize the API server
const startServer = async (port) => {
  try {
    // Initialize the databases
    await initializeDatabases(app);
    
    // Set up routes
    setupAuthRoutes(app, expressApp);
    setupMemberRoutes(app, expressApp);
    setupIncomeRoutes(app, expressApp);
    setupSettingsRoutes(app, expressApp);
    
    // Start the server
    expressApp.listen(port, () => {
      console.log(`Local API server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
  }
};

// This is needed because the server.js file is required before app is available
let app;
const setApp = (electronApp) => {
  app = electronApp;
};

module.exports = { startServer, setApp };
