const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop the problematic firstName index if it exists
    try {
      await collection.dropIndex('firstName_1');
      console.log('✅ Dropped firstName_1 index');
    } catch (error) {
      console.log('ℹ️ firstName_1 index does not exist or already dropped');
    }
    
    // Ensure only email index exists as unique
    try {
      await collection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created unique email index');
    } catch (error) {
      console.log('ℹ️ Email index already exists');
    }
    
    console.log('Index fix completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
