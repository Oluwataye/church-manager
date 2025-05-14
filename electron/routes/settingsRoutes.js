
const { initializeDb } = require('../db/dbUtils');

const setupSettingsRoutes = (app, expressApp) => {
  expressApp.get('/settings', async (req, res) => {
    try {
      const settingsDb = initializeDb(app, 'settings');
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
      const settingsDb = initializeDb(app, 'settings');
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

  // Specific endpoint for updating church name
  expressApp.post('/settings/church-name', async (req, res) => {
    try {
      const { church_name } = req.body;
      
      if (!church_name || typeof church_name !== 'string') {
        return res.status(400).json({ error: 'Church name is required and must be a string' });
      }
      
      const settingsDb = initializeDb(app, 'settings');
      await settingsDb.read();
      
      // Update church name
      settingsDb.data.settings = {
        ...settingsDb.data.settings,
        church_name,
        updated_at: new Date().toISOString()
      };
      
      await settingsDb.write();
      
      // Notify the main process about the church name change
      // This could be expanded to notify renderer processes if needed
      if (app && app.mainWindow) {
        app.mainWindow.webContents.send('church-name-updated', { church_name });
      }
      
      return res.json({ church_name, success: true });
    } catch (error) {
      console.error('Error updating church name:', error);
      return res.status(500).json({ error: 'Failed to update church name' });
    }
  });
};

module.exports = { setupSettingsRoutes };
