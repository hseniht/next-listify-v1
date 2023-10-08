const { Tag_model, Todo_model } = require("../models/listModels");
const mongoose = require("mongoose");
// GET all Todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo_model.find({});
    const tagsC = await Tag_model.find({});

    // NOTE: 'toObject()' or 'lean()' to filter mongoose model
    // toObject() helps filter our "real mongoose" docs and returns us plain Js object

    const tagsCWithStrings = tagsC.map((tag) => {
      return {
        // Alt way without using 'toObject()' mongoose helper
        // const { _id, ...rest } = tag._doc;  // Destructure _id and get the rest of the fields

        ...tag.toObject(),
        _id: tag._id.toString(),
      };
    });

    // Map each todo and add the corresponding tagsC objects to the "tagsDetail" property
    const todosWithTagsC = todos.map((todo) => ({
      ...todo.toObject(),
      tagsDetail: todo.tags
        ? tagsCWithStrings.filter((tag) => todo.tags.includes(tag._id))
        : [],
    }));

    res.status(200).json(todosWithTagsC);
    // res.status(200).json(todos);
  } catch (error) {
    console.error("Failed to fetch todos", error);
    res.status(500).json({ error: "Failed to fetch todos or tags" });
  }
};

// GET a single Todo
const getTodo = async (req, res) => {
  const { id } = req.params;
  //use mongoose to check valid "id" otherwise might face "BSONError"
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Todo not found" });
  }

  try {
    //to query "_id", use findById() instead of findOne() in mongoose.
    const todo = await Todo_model.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error("Failed to get todo", error);
    return res.status(500).json({ error: "Failed to get todo" });
  }
};

// POST a new Todo
const createTodo = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    const newTodo = await Todo_model.create({ title, description, tags });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Failed to save todo", error);
    res.status(400).json({ error: error.message });
  }
};

// DELETE a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  //use mongoose to check valid "id" otherwise might face "BSONError"
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const result = await Todo_model.findOneAndDelete({ _id: id });
  if (!result) {
    // NOTE: 404 instead of 500 (server error)
    // because the error is coming from the client and not from the server.
    return res.status(404).json({ error: "Todo not found" });
  }
  //NOTE: after deleting should be 204 (no content) rather than 200 (success)
  res.sendStatus(204);
};

// UPDATE a todo
const updateTodo = async (req, res) => {
  //   const { title, description, tags } = req.body;
  const { id } = req.params;
  //use mongoose to check valid "id" otherwise might face "BSONError"
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Todo not found" });
  }

  // todo: check `findByIdAndUpdate()` and compare
  const result = await Todo_model.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true } // This option returns the updated document otherwise it'll return back the old one
  );
  if (!result) {
    console.error("Failed to update todo", error);
    return res.status(404).json({ error: "Todo not found" });
  }
  const tags = req.body.tags;
  const tagsC = await Tag_model.find({});
  const filteredTags = tagsC.filter((tag) => tags.includes(tag._id.toString()));
  let updatedTodo = { ...result.toObject(), tagsDetail: filteredTags }; // result with the corresponding tags detail

  return res.status(200).json(updatedTodo); // or can use 200 to return back content
};

// get all Tags
const getTags = async (req, res) => {
  const tags = await Tag_model.find({});
  res.status(200).json(tags);
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
  getTags,
};
