const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");
const { Tag_model, Todo_model } = require("./models/listModels");
const listAPIRoutes = require("./routes/lists");
const userAPIRoutes = require("./routes/user");
const app = express();
require("dotenv").config(); // for .env variables
const port = process.env.PORT; // or any other port number you prefer

// Enable JSON parsing for incoming requests body (middleware)
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://next-listify-v1.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true); // If you need credentials
  next(); //to continue run next function
});

// Handle preflight requests (OPTIONS)
// app.options("*", (req, res) => {
//   res.sendStatus(204); // Respond with a "No Content" status for OPTIONS requests
// });

// preflight - for GET todos
app.options("/api/notepad/todos", (req, res) => {
  res.sendStatus(200);
});

// preflight - for POST, DELETE, UPDATE todos
app.options("/api/notepad/todos/:id", (req, res) => {
  res.sendStatus(200);
});

// In-memory storage for todos
// let todos = [
//   { id: 1, title: "Todo 1", description: "Description 1" },
//   { id: 2, title: "Todo 2", description: "Description 2" },
// ];

// const url = "mongodb://localhost:27017";
const url = process.env.MONGODB_CONNECTION_STRING;

// With mongoose, this variables are longer used
// const dbName = "notepad";
// let dbClient;
// let todoCollection;
// let tagsCollection;

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
  //baseUrl 'notepad'
  //NOTE: 'userAPIRoutes' must run first in order to get 'token' before any other API request
  app.use("/api/notepad", userAPIRoutes);
  app.use("/api/notepad", listAPIRoutes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
