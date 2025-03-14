
const { initializeDb } = require('../db/dbUtils');

const setupAuthRoutes = (app, expressApp) => {
  expressApp.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const usersDb = initializeDb(app, 'users');
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
      const usersDb = initializeDb(app, 'users');
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
};

module.exports = { setupAuthRoutes };
