/* Seeder Script */
import { MongoClient } from 'mongodb'

 // importing environmental variables
 import { config } from "dotenv";
 config()
     


import { productData } from './productSeedData.js';
import { shopData } from './shopSeedData.js';


async function seedProductsCollections() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const collection = await client.db('sample_analytics').collection('products');

    const [dropConfirmation, insertData] = await Promise.all([
      collection.drop(),
      collection.insertMany(productData),
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
seedProductsCollections();


async function seedShopsCollections() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const collection = await client.db('sample_analytics').collection('shops');

    const [dropConfirmation, insertData] = await Promise.all([
      // collection.drop(),
      collection.insertMany(shopData),
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

  //   client.connect((err) => {
  //     // const collection = client.db("farmland").collection("devices");
  //     // perform actions on the collection object
  //     console.log('testing');
  //     client.close();
  //     console.log('connectionClosed');
  //   });
}
// seedShopsCollections()