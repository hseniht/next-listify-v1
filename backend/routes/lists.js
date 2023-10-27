const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const {
  getTodos,
  getTodo,
  getTags,
  createTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/listController");
const requireAuth = require("../middleware/requireAuth");

// -----------------------------
//   Routes without TOKENS:
// -----------------------------

// GET all tags
router.get("/tags", getTags);

// -----------------------------
//   Routes with TOKENS:
// -----------------------------

// 'use' method is used to apply middleware functions to routes.
// 'Middlewares' can perform tasks or checks before or after handling a request.

// before ANY route handler for this router is executed,
// this will check 1st whether the user is authenticated and allowed to access the route.
router.use(requireAuth);

// GET All note
router.get("/todos", getTodos);

// GET a single note
router.get("/todos/:id", getTodo);

// POST a new note
router.post("/todos", createTodo);

// DELETE a note
router.delete("/todos/:id", deleteTodo);

// UPDATE a note
router.patch("/todos/:id", updateTodo);

module.exports = router;
