/* Seeder Script */
import { MongoClient } from 'mongodb';

// importing environmental variables
import { config } from 'dotenv';
config();

import { salesSeedData2020 } from './sales/salesSeedData2020V1.js';
import { salesSeedData2021 } from './sales/salesSeedData2021V1.js';

async function seedSalesEntriesCollections() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    const combinedEntries = [...salesSeedData2020, ...salesSeedData2021];
    const timeStampedEntires = combinedEntries.map((saleEntry) => {
      saleEntry.createdAt = new Date();
      saleEntry.updatedAt = new Date();
      return saleEntry;
    });
    await client.connect();
    console.log('Connected successfully to server');
    const collection = await client
      .db('sample_analytics')
      .collection('salesEntries');

    const [dropConfirmation, insertData] = await Promise.all([
      collection.drop(),
      collection.insertMany(timeStampedEntires),
    ]);
    // const insertedData = await collection.insertMany(shopData);
    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    // const dropped = await collection.drop();
    // console.log(dropped);

    console.log('Database seeded! :)');
    client.close();
  } catch (err) {
    console.log(err.stack);
    console.log(err);
    process.exit(-1);
  }
}
seedSalesEntriesCollections();
