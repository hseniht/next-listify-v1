import { useEffect, useState } from "react";
import Link from "next/link";
import { PageWrapper } from "../../components/ui/layout";
import { FloatButton, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TODOS_API_URL, TAGS_API_URL } from "../../constants/constants";
import styles from "../../styles/pages/list.module.css";
import { ModalBox } from "../../components/ui/ui";
import { Section } from "../../components/ui/layout";
import { TodoList } from "../../components/views/list";
import { TodoTags } from "../../components/views/list";
import { TodoListTable } from "../../components/views/list";
import { useTodosContext } from "../../hooks/useTodoListContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRouter } from "next/router";

const { Title } = Typography;

export default function ListPage() {
  const { todos, dispatch } = useTodosContext();
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const initialFetch = async () => {
      let initialTodos = [];
      let initialTags = [];

      try {
        const todosResponse = await fetch(TODOS_API_URL, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const tagsResponse = await fetch(TAGS_API_URL);

        if (todosResponse.ok) {
          initialTodos = await todosResponse.json();
          dispatch({ type: "SET_TODOS", payload: initialTodos });
        }
        if (tagsResponse.ok) {
          initialTags = await tagsResponse.json();
          setTags(initialTags);
        }
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    if (user) {
      initialFetch();
    } else {
      router.push("/login");
    }
  }, [user]);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [todo, setTodo] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTags, setNewTags] = useState([]);

  // todo: refactor with hooks implementation

  const handleFetch = async () => {
    try {
      const response = await fetch(`${TODOS_API_URL}`, {
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

  const resetCreateForm = () => {
    setNewTodo("");
    setNewTodoDescription("");
    setNewTags([]);
  };

  const addTodo = async () => {
    if (!user) {
      // todo: add as 'error message' state on form
      alert("You must be logged in");
      return;
    }
    if (newTodo.trim() !== "") {
      const todo = {
        title: newTodo,
        description: newTodoDescription,
        tags: newTags,
      };

      try {
        const response = await fetch(TODOS_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(todo),
        });

        if (response.ok) {
          const savedTodo = await response.json();
          dispatch({ type: "CREATE_TODO", payload: savedTodo });
          resetCreateForm();
          setShowCreate(false);
        } else {
          console.error("Failed to save todo");
        }
      } catch (error) {
        console.error("Failed to save todo", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    if (!user) {
      alert("You must be logged in");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${TODOS_API_URL}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          console.log("Succesfully deleted a todo item");
          //TODO if:
          // Network performance is a concern? -> Filter out deleted record from local state.
          // Data consistency is crucial? -> Update state from backend.
          // await handleFetch();
          dispatch({ type: "DELETE_TODO", payload: id });
        } else {
          console.error("Failed to delete todo");
        }
      } catch (error) {
        console.error("Failed to delete todo", error);
      }
    }
  };

  const handleEdit = async (id) => {
    if (!user) {
      alert("You must be logged in");
      return;
    }
    setTodo(""); //reset
    setShowEdit(true);
    try {
      const response = await fetch(`${TODOS_API_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const todo = await response.json();
        const { _id, description, tags = [], title } = todo;
        //filter tags for '_id' field only (for UI component)
        const tagsId = tags.map((tag) => tag._id);
        setTodo({ _id, description, tags, title });
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
    if (!user) {
      alert("You must be logged in");
      return;
    }
    // const updatedTodo = todo;
    const { _id, title, description, tags } = todo;

    let updatedTodo = {
      title: title,
      description: description,
      tags: tags || [], // Set default value to an empty array if tags is undefined or null
    };

    try {
      const response = await fetch(`${TODOS_API_URL}/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setShowEdit(false);
        updatedTodo = await response.json(); //this has with more fields
        dispatch({ type: "UPDATE_TODO", payload: updatedTodo });
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

  const handleEditTags = (arr) => {
    setTodo({ ...todo, tags: arr });
  };

  return (
    <PageWrapper id={"notesPage"} className={styles.todo}>
      {/* <Link href={"/"}>{"< Back to home"}</Link> */}
      <h1 className={styles.todo__heading}>Todo List</h1>
      {/* create */}
      {showCreate && (
        <ModalBox onClose={() => setShowCreate(false)}>
          <div>Create New</div>
          <Section className={styles.todo__input}>
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
            {/* //tags */}
            <TodoTags
              items={tags}
              selectedItems={newTags}
              onSelectItem={setNewTags}
            />
            <button onClick={addTodo}>Add Todo</button>
          </Section>
        </ModalBox>
      )}
      {/* -------tables ---------*/}
      <Section className={styles.todo_table}>
        <TodoListTable
          dataSource={todos}
          onEdit={handleEdit}
          onDelete={deleteTodo}
          rowKey={"_id"} //unique field from out dataset
        />
      </Section>
      {/* edit */}
      {showEdit && (
        <ModalBox onClose={() => setShowEdit(false)}>
          <div>Edit</div>
          {!todo ? (
            <div>Loading ...</div> //Todo: Hide this if failed
          ) : (
            <Section className={styles.todo__input}>
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
              <TodoTags
                items={tags}
                selectedItems={todo.tags}
                onSelectItem={handleEditTags}
              />
              <button onClick={handleSave}>Save edits</button>
            </Section>
          )}
        </ModalBox>
      )}
      {/* <Section className={styles.todo__output}>
        <TodoList todos={todos} onEdit={handleEdit} onDelete={deleteTodo} />
      </Section> */}
      {!showCreate && !showEdit && (
        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          tooltip="Create Note"
          onClick={() => setShowCreate(true)}
        />
      )}
    </PageWrapper>
  );
}

// export async function getServerSideProps() {
//   // Simulating fetching todos from an API endpoint
//   // const response = await fetch("https://jsonplaceholder.typicode.com/todos");
//   let initialTodos = [];
//   let initialTags = [];

//   try {
//     const todosResponse = await fetch(TODOS_API_URL);
//     const tagsResponse = await fetch(TAGS_API_URL);

//     if (todosResponse.ok) {
//       initialTodos = await todosResponse.json();
//     }
//     if (tagsResponse.ok) {
//       initialTags = await tagsResponse.json();
//     }
//     return {
//       props: {
//         initialTodos,
//         initialTags,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     // Handle the error
//     return {
//       props: {
//         initialTodos,
//         initialTags,
//         error: "Failed to fetch todos",
//       },
//     };
//   }
// }
