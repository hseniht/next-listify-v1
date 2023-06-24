const express = require("express");
const app = express();
const port = 3001; // or any other port number you prefer

// Define API routes and logic here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/api/todos", (req, res) => {
  // Add logic to fetch todos from data source (database, file, etc.)
  const todos = [
    { id: 1, title: "Todo 1", description: "Description 1" },
    { id: 2, title: "Todo 2", description: "Description 2" },
    // Add more todos as needed
  ];

  res.json(todos);
});
