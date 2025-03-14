
// Default data for initializing databases

const getDefaultUsers = () => [
  {
    id: '1',
    email: 'admin@lfcc.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

const getDefaultSettings = () => ({
  church_name: 'Living Faith Church Chanchaga',
  logo_url: null
});

module.exports = {
  getDefaultUsers,
  getDefaultSettings
};
