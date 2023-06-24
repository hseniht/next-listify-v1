import { useState } from "react";
import styles from "../../styles/pages/list.module.css";

export default function ListPage({
  initialTodos = [], //default value
}) {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo = {
        id: Date.now(),
        title: newTodo,
        description: newTodoDescription,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setNewTodoDescription("");
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <section className={styles.todo__input}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo title..."
        />
        <textarea
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="Enter a new todo description..."
        ></textarea>
        <button onClick={addTodo}>Add Todo</button>
      </section>
      <section className="todo__output">
        <ul>
          {todos.map((todo, index) => (
            <li key={todo.id}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  // Simulating fetching todos from an API endpoint
  // const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const response = await fetch("http://localhost:3001/api/todos");
  const initialTodos = await response.json();

  return {
    props: {
      initialTodos,
    },
  };
}
