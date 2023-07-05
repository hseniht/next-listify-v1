import { useState } from "react";
import { API_URL } from "../../constants/constants";
import styles from "../../styles/pages/list.module.css";
import { ModalBox } from "../../components/ui/ui";

export default function ListPage({
  initialTodos = [], //default value
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [todo, setTodo] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");

  const handleFetch = async () => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "GET",
      });

      if (response.ok) {
        const todos = await response.json();
        setTodos(todos);
      } else {
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  };

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

  const handleEdit = async (id) => {
    setTodo(""); //reset
    setShowEdit(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
      });

      if (response.ok) {
        const todo = await response.json();
        setTodo(todo);
        // const editTodo = response
        // setTodos(updatedTodos);
      } else {
        console.error("Failed to get a todo");
      }
    } catch (error) {
      console.error("Failed to get a todo", error);
    }
  };

  const handleSave = async () => {
    // const updatedTodo = todo;
    const { _id, title, description } = todo;

    const updatedTodo = {
      title: title,
      description: description,
    };

    try {
      const response = await fetch(`${API_URL}/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setShowEdit(false);
        await handleFetch();
      } else {
        console.error("Failed to save todo");
      }
    } catch (error) {
      console.error("Failed to save todo", error);
    }
  };

  const handleInputChange = (e, field) => {
    setTodo({ ...todo, [field]: e.target.value });
  };

  return (
    <div className={styles.todo}>
      <h1 className={styles.todo__heading}>Todo List</h1>
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
      {showEdit && (
        <ModalBox onClose={() => setShowEdit(false)}>
          <div>Edit</div>
          {!todo ? (
            <div>Loading ...</div>
          ) : (
            <section className={styles.todo__input}>
              <input
                type="text"
                value={todo.title}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Enter a new todo title..."
              />
              <textarea
                value={todo.description}
                onChange={(e) => handleInputChange(e, "description")}
                placeholder="Enter a new todo description..."
              ></textarea>
              <button onClick={handleSave}>Save edits</button>
            </section>
          )}
        </ModalBox>
      )}
      <section className={styles.todo__output}>
        <ul className={styles["todo__output--wrapper"]}>
          {todos.map((todo, index) => (
            <li className={styles["todo__output--list"]} key={todo._id}>
              <button
                value={todo._id}
                onClick={(e) => handleEdit(e.target.value)}
                style={{ float: "right" }}
              >
                +
              </button>
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
