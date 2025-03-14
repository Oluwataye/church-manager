
const { initializeDb } = require('../db/dbUtils');

const setupMemberRoutes = (app, expressApp) => {
  expressApp.get('/members', async (req, res) => {
    try {
      const membersDb = initializeDb(app, 'members');
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
      const membersDb = initializeDb(app, 'members');
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
};

module.exports = { setupMemberRoutes };
