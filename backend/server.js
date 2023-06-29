const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3001; // or any other port number you prefer

// Enable JSON parsing for incoming requests (middleware)
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// In-memory storage for todos
// let todos = [
//   { id: 1, title: "Todo 1", description: "Description 1" },
//   { id: 2, title: "Todo 2", description: "Description 2" },
// ];

const url = "mongodb://localhost:27017";
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
  try {
    const todos = await todoCollection.find().toArray();
    res.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/notepad/todos", (req, res) => {
  const { title, description } = req.body;
  const todo = {
    id: Date.now(), //generate unique id
    title,
    description,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.delete("/notepad/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id !== parseInt(id));
  res.sendStatus(204);
});
