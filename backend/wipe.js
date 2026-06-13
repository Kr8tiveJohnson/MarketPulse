const mongoose = require('mongoose');
require('dotenv').config();

const clearDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("MONGODB_URI is missing");
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB for wiping data...");

  // Drop collections
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.drop();
    console.log(`Dropped collection: ${collection.collectionName}`);
  }

  console.log("Database wiped successfully!");
  process.exit(0);
};

clearDB();
