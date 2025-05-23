require('dotenv').config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const express = require("express");
const bodyParser = require('body-parser');
const axios = require("axios");
const { MongoClient, ServerApiVersion } = require('mongodb'); // MongoClient lets us connect to our database
const cors = require('cors'); 


/* INITIALIZE DATABASE */
const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
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

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());
app.use(bodyParser.json()); // to parse the JSON in requests 
app.use(bodyParser.urlencoded({ extended: false })); // to parse URLs
app.use('/v1', route); // add the routes we make

app.listen(port, () => {    
  console.log(`Server listening on port ${port}`);
});

/* ACCESS DATABASE */
async function insertFlower (newFlower) {
  try {
      const flowersCollection = client.db(DB_NAME).collection("flowers");

      // Ensure color is an array
      if (Array.isArray(newFlower.color)) {
        newFlower.color = newFlower.color.map(color => color.trim());  // Sanitize colors (trim extra spaces)
      } else {
        newFlower.color = [newFlower.color.trim()];  // If it's a single color, make it an array
      }

      const result = await flowersCollection.insertOne(newFlower);

      return await flowersCollection.findOne({ _id: result.insertedId });
  } catch (error) {
      console.error("Error inserting flower into the database:", error);
      throw error;
  }
};

async function getAllFlowers () {
  // get flower collection and find all flowers
  const flowersCollection = client.db(DB_NAME).collection("flowers");
  return await flowersCollection.find().toArray();
};

async function getFlower (name) {
  // get flower collection and find flowers that match name
  const flowersCollection = client.db(DB_NAME).collection("flowers");
  return await flowersCollection.find({ 
    name: { $regex: new RegExp(name, 'i') } // Case-insensitive regex search
  }).toArray();
};

async function getFlowerByColor (color) {
  // get flower collection and find flowers that match name
  const flowersCollection = client.db(DB_NAME).collection("flowers");
  return await flowersCollection.find({ 
    color: { $regex: new RegExp(color, 'i') } // Case-insensitive search
  }).toArray();
};

async function getFlowerByMeaning (meaning) {
  // get flower collection and find flowers that match name
  const flowersCollection = client.db(DB_NAME).collection("flowers");
  return await flowersCollection.find({ 
    meaning: { $regex: new RegExp(meaning, 'i') } // Case-insensitive search
  }).toArray();
};

/* WEEK 4: DATABASE ROUTES */
route.post('/flowers', async (req, res) => {
  try {
    console.log(req.body);
      const { name, color, meaning } = req.body;
      if (!name || !color || !meaning) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      const newFlower = { name, color: Array.isArray(color) ? color : [color], meaning };

      const createdFlower = await insertFlower(newFlower);
      console.log("Inserted new flower:", createdFlower);
      res.status(201).json(createdFlower);
  } catch (error) {
      console.error("Failed to create a new flower:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

route.delete('/flowers/:name?', async (req, res) => {
  try {
    const { name } = req.params;  // Extract flower name from URL parameters
    const flowersCollection = client.db(DB_NAME).collection("flowers");
    // Delete the flower with the matching name
    const result = await flowersCollection.deleteOne({ name });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Flower not found" });
    }

    res.status(200).json({ message: `Flower with name ${name} deleted successfully` });
  } catch (error) {
    console.error("Failed to delete the flower:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get('/flowers/meaning/:meaning?', async (req, res) => {
  try {
    const meaning = req.params.meaning;
    let flowers;

    if (meaning) {
      flowers = await getFlowerByMeaning(meaning); // search by meaning
    } else {
      flowers = await getAllFlowers(); // get all flowers if no meaning is provided
    }

    console.log("Fetched flowers:", flowers);
    res.status(200).json(flowers);
  } catch (error) {
    console.error("Failed to fetch flowers by meaning:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


route.get('/flowers/:name?', async (req, res) => {
  try {
      const name = req.params.name;
      let flowers;

      if (name) {
          flowers = await getFlower(name);
      }
      else {
          flowers = await getAllFlowers(); // get flowers
      }
  
      console.log("Fetched flowers:", flowers);
      res.status(200).json(flowers);
  } catch (error) {
      console.error("Failed to fetch all flowers:", error);
      res.status(500).json({ error: message });
  }
});


route.get('/flowers/color/:color?', async (req, res) => {
  try {
      const color = req.params.color;
      let flowers;

      if (color) {
          flowers = await getFlowerByColor(color);
      }
      else {
          flowers = await getAllFlowers(); // get flowers
      }
  
      console.log("Fetched flowers:", flowers);
      res.status(200).json(flowers);
  } catch (error) {
      console.error("Failed to fetch flowers by color:", error);
      res.status(500).json({ error: message });
  }
});