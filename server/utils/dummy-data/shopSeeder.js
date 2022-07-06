/* Seeder Script */
import { MongoClient } from 'mongodb';

// importing environmental variables
import { config } from 'dotenv';
config();

import shopData from './shop/shopSeedData.js';

async function seedShopsCollections() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const collection = await client.db('sample_analytics').collection('shops');

    const [dropConfirmation, insertData] = await Promise.all([
      collection.drop(),
      collection.insertMany(shopData),
    ]);

    console.log('Database seeded! :)');
    client.close();
  } catch (err) {
    console.log(err.stack);
    console.log(err);
    process.exit(-1);
  }
}
seedShopsCollections();
