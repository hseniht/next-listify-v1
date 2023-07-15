//Todo: Add modular list component here
import styles from "../../styles/pages/list.module.css";

//ul lists
export const TodoList = ({ todos, onEdit, onDelete }) => {
  return (
    <ul className={styles["todo__output--wrapper"]}>
      {todos.map((todo, index) => (
        <li className={styles["todo__output--list"]} key={todo._id}>
          <button
            value={todo._id}
            onClick={(e) => onEdit(e.target.value)}
            style={{ float: "right" }}
          >
            +
          </button>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <button onClick={() => onDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
