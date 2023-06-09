const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3001; // or any other port number you prefer
require("dotenv").config(); //for .env variables

// Enable JSON parsing for incoming requests (middleware)
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// In-memory storage for todos
// let todos = [
//   { id: 1, title: "Todo 1", description: "Description 1" },
//   { id: 2, title: "Todo 2", description: "Description 2" },
// ];

// const url = "mongodb://localhost:27017";
const url = process.env.MONGODB_CONNECTION_STRING;
const dbName = "notepad";
const collectionName = "todos";

let dbClient;
let todoCollection;

// Establish database connection
async function connectToDatabase() {
  try {
    dbClient = await MongoClient.connect(url);
    const db = dbClient.db(dbName);
    todoCollection = db.collection(collectionName);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

// Connect to the database when the server starts
connectToDatabase();

// Define API routes and logic here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/notepad/todos", async (req, res) => {
  const page = req.query.page || 0; // defaults zero if not specified
  const listPerPage = 3;
  try {
    const todos = await todoCollection
      .find()
      // .skip(page * listPerPage)
      // .limit(listPerPage)
      .toArray();
    res.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/notepad/todos", async (req, res) => {
  const todo = req.body;
  try {
    const result = await todoCollection.insertOne(todo);
    const savedTodo = { ...todo, _id: result.insertedId };
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error("Failed to save todo", error);
    res.status(500).json({ error: "Failed to create todos note" });
  }
});

app.delete("/notepad/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await todoCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.sendStatus(204);
      //NOTE: after deleting should be 204 (no content) rather than 200 (success)
    } else {
      res.status(404).json({ error: "Todo not found" });
      // NOTE: 404 instead of 500 (server error)
      // because the error is coming from the client and not from the server.
    }
  } catch (error) {
    console.error("Failed to delete todo", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.get("/notepad/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await todoCollection.findOne({ _id: new ObjectId(id) });
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Failed to get todo", error);
    res.status(500).json({ error: "Failed to get todo" });
  }
});

app.patch("/notepad/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const result = await todoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (result.matchedCount === 1) {
      res.sendStatus(204); // or can use 200 to return back content
    } else {
      res.status(404).json({ error: "Todo not found" });
      // NOTE: 404 instead of 500 (server error)
      // because the error is coming from the client and not from the server.
    }
  } catch (error) {
    console.error("Failed to update todo", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});
