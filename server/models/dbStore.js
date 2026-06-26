const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Helper to initialize files if they don't exist
function initFile(filePath, defaultData = []) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

initFile(USERS_FILE);
initFile(BOOKINGS_FILE);

function readData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading database file ${filePath}:`, error);
    return [];
  }
}

function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing database file ${filePath}:`, error);
  }
}

// Generate unique ID mimicking MongoDB ObjectId
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
  getUsers: () => readData(USERS_FILE),
  saveUsers: (users) => writeData(USERS_FILE, users),
  getBookings: () => readData(BOOKINGS_FILE),
  saveBookings: (bookings) => writeData(BOOKINGS_FILE, bookings),
  generateId,
};
