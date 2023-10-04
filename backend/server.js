const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");
const { Tag_model, Todo_model } = require("./models/listModels");
const createListRoutes = require("./routes/lists");
const app = express();
require("dotenv").config(); //for .env variables
const port = process.env.PORT; // or any other port number you prefer

// Enable JSON parsing for incoming requests body (middleware)
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next(); //to continue run next function
});

// In-memory storage for todos
// let todos = [
//   { id: 1, title: "Todo 1", description: "Description 1" },
//   { id: 2, title: "Todo 2", description: "Description 2" },
// ];

// const url = "mongodb://localhost:27017";
const url = process.env.MONGODB_CONNECTION_STRING;
const dbName = "notepad";

let dbClient;
let todoCollection;
let tagsCollection;

// Establish database connection
async function connectToDatabase() {
  try {
    // OLD: MongoDB way
    // dbClient = await MongoClient.connect(url);
    // const db = dbClient.db(dbName);
    // todoCollection = db.collection("todos");
    // tagsCollection = db.collection("tags");
    // console.log("Connected to the database");
    mongoose.connect(url);

    await Todo_model.find({})
      .then((todos) => {
        todoCollection = todos;
      })
      .catch((err) => {
        console.error("Error retrieving todos:", err);
      });

    await Tag_model.find({})
      .then((tags) => {
        tagsCollection = tags;
        // console.log("Todos:", todos);
      })
      .catch((err) => {
        console.error("Error retrieving tags:", err);
      });
    console.log("connected mongoose");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

// Connect to the database when the server starts
connectToDatabase().then(() => {
  const listAPIRoutes = createListRoutes(todoCollection, tagsCollection);
  //baseUrl 'notepad'
  app.use("/notepad", listAPIRoutes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
