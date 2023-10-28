const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: false,
    },
    // ... other fields as needed
  },
  { timestamps: true }
);

const tagSchema = new Schema({
  name: String,
  color: String,
  // ... other fields as needed
});

// Create models based on the schemas
// const Todo_model = mongoose.model("todo", todoSchema);
const Todo_model = mongoose.model("list", todoSchema); //use 'lists' table to store records
const Tag_model = mongoose.model("tag", tagSchema);

module.exports = {
  Tag_model,
  Todo_model,
};
