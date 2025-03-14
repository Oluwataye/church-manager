
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
};

module.exports = { setupIncomeRoutes };
