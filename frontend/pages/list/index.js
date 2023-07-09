import { useState } from "react";
import { API_URL } from "../../constants/constants";
import styles from "../../styles/pages/list.module.css";
import { ModalBox } from "../../components/ui/ui";
import { Button, Table, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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

  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("Succesfully deleted a todo item");
          //TODO if:
          // Network performance is a concern? -> Filter out deleted record from local state.
          // Data consistency is crucial? -> Update state from backend.
          await handleFetch();
        } else {
          console.error("Failed to delete todo");
        }
      } catch (error) {
        console.error("Failed to delete todo", error);
      }
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

  const tableActions = (param1, record) => {
    return (
      <div>
        <Tooltip title="edit">
          <Button
            value={record._id}
            onClick={(e) => handleEdit(record._id)}
            icon={<EditOutlined />}
          />
        </Tooltip>
        <Tooltip title="delete">
          <Button
            danger
            onClick={() => deleteTodo(record._id)}
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      </div>
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: tableActions,
    },
  ];

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
      <section className="list_todo_table">
        <Table
          pagination={{ pageSize: 5 }}
          columns={columns}
          dataSource={todos}
        />
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
