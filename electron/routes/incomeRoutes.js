
const { initializeDb } = require('../db/dbUtils');

const setupIncomeRoutes = (app, expressApp) => {
  expressApp.get('/income', async (req, res) => {
    try {
      const incomeDb = initializeDb(app, 'income');
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
      const incomeDb = initializeDb(app, 'income');
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

  // New endpoint to get tithes by member ID
  expressApp.get('/income/member/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const incomeDb = initializeDb(app, 'income');
      await incomeDb.read();
      
      // Filter income records to get only tithes for the specified member
      const memberTithes = incomeDb.data.income.filter(
        income => income.category === 'tithe' && income.member_id === id
      );
      
      return res.json(memberTithes);
    } catch (error) {
      console.error('Error fetching member tithes:', error);
      return res.status(500).json([]);
    }
  });
};

module.exports = { setupIncomeRoutes };
