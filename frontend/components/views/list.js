//Todo: Add modular list component here
import { useState } from "react";
import styles from "../../styles/pages/list.module.css";
import formStyle from "../../styles/ui/forms.module.css";
import { Button, Select, Space, Table, Tag, Tooltip, Input } from "antd";
// import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Section } from "../ui/layout";
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

export const TodoTags = ({ items, selectedItems, onSelectItem }) => {
  // const [selectedItems, setSelectedItems] = useState([]);
  // const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  // const filteredOptions = options3.filter((o) => !selectedItems.includes(o));

  const handleSelect = (value, option) => {
    setSelectedItems(value);
  };

  return (
    <Select
      mode="multiple"
      optionLabelProp="name" //which option field to display
      placeholder="Tags"
      value={selectedItems}
      // onChange={handleSelect}
      onChange={onSelectItem}
      style={{
        width: "100%",
      }}
    >
      {items.map((item) => (
        <Option key={item._id} value={item._id} name={item.name}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};

//Todo-list Table
export const TodoListTable = ({ dataSource, onEdit, onDelete, ...props }) => {
  const tableActions = (param1, record) => {
    return (
      <div>
        <Tooltip title="edit">
          <Button
            value={record._id}
            onClick={(e) => onEdit(record._id)}
            icon={<EditOutlined />}
          />
        </Tooltip>
        <Tooltip title="delete">
          <Button
            danger
            onClick={() => onDelete(record._id)}
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      </div>
    );
  };

  const tagColumn = (_, { tagsDetail = [] }) => {
    return (
      <>
        {tagsDetail.map((item) => (
          <Tag key={item._id} color={item.color} bordered={false}>
            {item.name}
          </Tag>
        ))}
      </>
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
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: tagColumn,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: tableActions,
    },
  ];

  return (
    <Table
      pagination={{ pageSize: 5 }}
      columns={columns}
      dataSource={dataSource}
      // rowKey={rowKey} //unique field from out dataset
      {...props}
    />
  );
};

export const TodoForm = ({
  title,
  description,
  tags,
  inputErrors,
  selectedTags,
  onChangeInput,
  onSelectTags,
  onSave,
}) => {
  const [touch, setTouch] = useState({
    title: false,
    description: false,
  });

  const handleInputs = (e) => {
    const field = e.target.name;
    // const newTouchFields = { ... touch};
    setTouch({ ...touch, [field]: true });
    onChangeInput(e);
  };

  const handleSave = () => {
    setTouch({ title: true, description: true });
    if (!title || !description) {
      return;
    }
    onSave();
  };

  return (
    <Section className={styles.todo__input}>
      <Input
        type="text"
        value={title}
        name={"title"}
        onChange={(e) => handleInputs(e)}
        // onChange={(onChangeInput)}
        placeholder="Enter a new todo title..."
        status={touch.title && !title ? "error" : ""}
      />
      {touch.title && !title && (
        <div className={formStyle.input__error}>{inputErrors.title}</div>
      )}
      <br />
      <Input.TextArea
        value={description}
        name={"description"}
        onChange={(e) => handleInputs(e)}
        // onChange={onChangeInput}
        placeholder="Enter a new todo description..."
        status={touch.description && !description ? "error" : ""}
      ></Input.TextArea>
      {touch.description && !description && (
        <div className={formStyle.input__error}>{inputErrors.description}</div>
      )}
      <br />
      <TodoTags
        items={tags}
        selectedItems={selectedTags}
        onSelectItem={onSelectTags}
      />
      <br />
      <br />
      <Button type="primary" size={"small"} onClick={handleSave}>
        Save
      </Button>
    </Section>
  );
};
