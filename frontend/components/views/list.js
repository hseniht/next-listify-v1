//Todo: Add modular list component here
import { useState } from "react";
import styles from "../../styles/pages/list.module.css";
import { Select, Space } from "antd";
// import type { CustomTagProps } from "rc-select/lib/BaseSelect";

const { Option } = Select;
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

//tags

const OPTION = [
  { _id: "s1", label: "Option 1", name: "NmOp 1" },
  { _id: "s2", label: "Option 2", name: "NmOp 2" },
  { _id: "s3", label: "Option 3", name: "NmOp 3" },
];

export const TodoTags = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  // const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  // const filteredOptions = options3.filter((o) => !selectedItems.includes(o));

  const handleSelect = (p1, p2) => {
    setSelectedItems(p1);
  };

  return (
    <Select
      mode="multiple"
      optionLabelProp="name" //which option field to display
      placeholder="Tags"
      value={selectedItems}
      onChange={handleSelect}
      style={{
        width: "100%",
      }}
    >
      {OPTION.map((option) => (
        <Option key={option._id} value={option._id} name={option.name}>
          {option.name}
        </Option>
      ))}
    </Select>
  );
};
