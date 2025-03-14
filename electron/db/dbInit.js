
const { initializeDb } = require('./dbUtils');
const { getDefaultUsers, getDefaultSettings } = require('./dbSeeds');

// Initialize database structure if it doesn't exist
const initializeDatabases = async (app) => {
  console.log('Initializing databases...');
  
  // Users database
  const usersDb = initializeDb(app, 'users');
  await usersDb.read();
  usersDb.data ||= { users: [] };
  
  // Check if we need to create an admin user
  if (usersDb.data.users.length === 0) {
    usersDb.data.users.push(...getDefaultUsers());
    await usersDb.write();
  }
  
  // Members database
  const membersDb = initializeDb(app, 'members');
  await membersDb.read();
  membersDb.data ||= { members: [] };
  await membersDb.write();
  
  // Income database
  const incomeDb = initializeDb(app, 'income');
  await incomeDb.read();
  incomeDb.data ||= { income: [] };
  await incomeDb.write();
  
  // Attendance database
  const attendanceDb = initializeDb(app, 'attendance');
  await attendanceDb.read();
  attendanceDb.data ||= { attendance: [] };
  await attendanceDb.write();

  // Events database
  const eventsDb = initializeDb(app, 'events');
  await eventsDb.read();
  eventsDb.data ||= { events: [] };
  await eventsDb.write();

  // Groups database
  const groupsDb = initializeDb(app, 'groups');
  await groupsDb.read();
  groupsDb.data ||= { groups: [] };
  await groupsDb.write();

  // Settings database
  const settingsDb = initializeDb(app, 'settings');
  await settingsDb.read();
  settingsDb.data ||= { settings: getDefaultSettings() };
  await settingsDb.write();
  
  console.log('Databases initialized successfully');
};

module.exports = { initializeDatabases };
