const mongoose = require('mongoose');

let isConnected = false;
let dbType = 'Local JSON File DB';

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  No MONGODB_URI provided in .env. Falling back to Local JSON File Database.');
    process.env.USE_LOCAL_DB = 'true';
    return;
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
    };
    
    let connectUri = uri;
    const credentialsMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@([^/?#]+)(.*)$/);
    if (credentialsMatch) {
      const [_, protocol, user, pass, host, rest] = credentialsMatch;
      options.user = decodeURIComponent(user);
      options.pass = decodeURIComponent(pass);
      connectUri = `${protocol}${host}${rest}`;
    }

    await mongoose.connect(connectUri, options);
    isConnected = true;
    dbType = 'MongoDB';
    console.log('✅ Connected to MongoDB Database successfully.');
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️  Falling back to Local JSON File Database.');
    process.env.USE_LOCAL_DB = 'true';
  }
}

module.exports = {
  connectDB,
  getDbType: () => dbType,
  isConnected: () => isConnected,
};
