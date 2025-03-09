const express = require("express");
const bodyParser = require('body-parser');
const axios = require("axios");
const { MongoClient, ServerApiVersion } = require('mongodb'); // MongoClient lets us connect to our database
const cors = require('cors');

/* INITIALIZE DATABASE */
const password = "lilyofthevalley"
const clusterName = "floriography-dictionary"
const uri = "mongodb+srv://hannie:lilyofthevalley@floriography-dictionary.ujtny.mongodb.net/?retryWrites=true&w=majority&appName=floriography-dictionary"
const DB_NAME = "hannie"
const CONNECTION_TIMEOUT = 5000;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function connectToDatabase() {
  try {
      console.log("Connecting to MongoDB...");

      const connectPromise = client.connect(); // Create promise for connection
      const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection timeout')), CONNECTION_TIMEOUT));
      await Promise.race([connectPromise, timeoutPromise]);

      await client.db(DB_NAME).command({ ping: 1 });
      console.log("Successfully connected!");
  } catch (error) {
      console.error("Database connection failed.");
      process.exit(1);
  }
}
connectToDatabase();

/* INITIALIZE SERVER */
const app = express();
const route = express.Router();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json()); // to parse the JSON in requests 
app.use(bodyParser.urlencoded({ extended: false })); // to parse URLs
app.use('/v1', route); // add the routes we make

app.listen(port, () => {    
  console.log(`Server listening on port ${port}`);
});

// /* ACCESS DATABASE */
// async function insertFlower (newFlower) {
//   try {
//       const flowersCollection = client.db(DB_NAME).collection("flowers");
//       const result = await flowersCollection.insertOne(newFlower);

//       return await flowersCollection.findOne({ _id: result.insertedId });
//   } catch (error) {
//       console.error("Error inserting flower into the database:", error);
//       throw error;
//   }
// };

// async function getAllFlowers () {
//   // get flower collection and find all flowers
//   const flowersCollection = client.db(DB_NAME).collection("flowers");
//   return await flowersCollection.find().toArray();
// };

// async function getFlower (name) {
//   // get flower collection and find flowers that match name
//   const flowersCollection = client.db(DB_NAME).collection("flowers");
//   return await flowersCollection.find({ name: name }).toArray();
// };