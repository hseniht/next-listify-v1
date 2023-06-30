import { useState } from "react";
import { API_URL } from "../../constants/constants";
import styles from "../../styles/pages/list.module.css";

export default function ListPage({
  initialTodos = [], //default value
}) {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const todo = {
        title: newTodo,
        description: newTodoDescription,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        });

        if (response.ok) {
          const savedTodo = await response.json();
          setTodos([...todos, savedTodo]);
          setNewTodo("");
          setNewTodoDescription("");
        } else {
          console.error("Failed to save todo");
        }
      } catch (error) {
        console.error("Failed to save todo", error);
      }
    }
  };

  const deleteTodo = async (index) => {
    const todo = todos[index];

    try {
      const response = await fetch(`${API_URL}/${todo._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
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
            <li key={todo._id}>
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
  let initialTodos = [];

  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      initialTodos = await response.json();
    }
    return {
      props: {
        initialTodos,
      },
    };
  } catch (error) {
    console.error(error);
    // Handle the error
    return {
      props: {
        initialTodos,
        error: "Failed to fetch todos",
      },
    };
  }
}
