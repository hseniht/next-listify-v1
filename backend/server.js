const express = require("express");
const app = express();
const port = 3001; // or any other port number you prefer

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// In-memory storage for todos
let todos = [
  { id: 1, title: "Todo 1", description: "Description 1" },
  { id: 2, title: "Todo 2", description: "Description 2" },
  // Add more todos as needed
];

// Define API routes and logic here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { title, description } = req.body;
  const todo = {
    id: Date.now(), //generate unique id
    title,
    description,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id !== parseInt(id));
  res.sendStatus(204);
});
