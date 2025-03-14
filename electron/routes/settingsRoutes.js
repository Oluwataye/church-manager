
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
};

module.exports = { setupSettingsRoutes };
