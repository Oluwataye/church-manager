
const express = require('express');
const cors = require('cors');
const { initializeDatabases } = require('./db/dbInit');

let app = null;

// Store the Electron app instance for use in routes
const setApp = (electronApp) => {
  app = electronApp;
};

// Start the local API server
const startServer = async (port) => {
  try {
    const expressApp = express();
    
    // Configure middleware
    expressApp.use(cors());
    expressApp.use(express.json());
    
    // Make sure the app is set before initializing databases
    if (!app) {
      console.error('Error: Electron app not set. Call setApp() before startServer()');
      return;
    }
    
    // Initialize databases
    await initializeDatabases(app);
    
    // Setup routes
    setupRoutes(expressApp);
    
    // Start the server
    expressApp.listen(port, () => {
      console.log(`Local API server running on port ${port}`);
    });
    
    // Handle server errors
    expressApp.on('error', (error) => {
      console.error('Express server error:', error);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Setup all routes
const setupRoutes = (expressApp) => {
  try {
    // Import route modules
    const { setupAuthRoutes } = require('./routes/authRoutes');
    const { setupMemberRoutes } = require('./routes/memberRoutes');
    const { setupSettingsRoutes } = require('./routes/settingsRoutes');
    const { setupIncomeRoutes } = require('./routes/incomeRoutes');
    
    // Setup routes with the app instance
    setupAuthRoutes(app, expressApp);
    setupMemberRoutes(app, expressApp);
    setupSettingsRoutes(app, expressApp);
    setupIncomeRoutes(app, expressApp);
    
    // Add a health check route
    expressApp.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });
    
    // Catch-all route for undefined routes
    expressApp.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  } catch (error) {
    console.error('Error setting up routes:', error);
  }
};

module.exports = { startServer, setApp };
