const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { Tag_model, Todo_model } = require("../models/listModels");
const {
  getTodos,
  getTodo,
  getTags,
  createTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/listController");
// function takes collection and returns route
// API routes and logic handled inside
function createListRoutes(todoCollection, tagsCollection) {
  router.get("/todos", getTodos);

  // GET a single note
  router.get("/todos/:id", getTodo);

  // POST a new note
  router.post("/todos", createTodo);

  // DELETE a note
  router.delete("/todos/:id", deleteTodo);

  // UPDATE a note
  router.patch("/todos/:id", updateTodo);

  // GET all tags
  router.get("/tags", getTags);

  return router;
}
module.exports = createListRoutes;
