import { createContext, useReducer } from "react";

export const TodoListContext = createContext();

export const todosReducer = (state, action) => {
  switch (action.type) {
    case "SET_TODOS":
      return {
        todos: action.payload, //add completely
      };
    case "CREATE_TODO":
      return {
        todos: [...state.todos, action.payload], //edit in current
      };
    case "DELETE_TODO":
      const id = action.payload;
      return {
        todos: state.todos.filter((todo) => todo._id !== id),
      };
    case "UPDATE_TODO":
      const { _id } = action.payload;
      const updatedTodos = state.todos.map((todo) => {
        if (todo._id === _id) {
          return action.payload;
        }
        return todo;
      });
      return {
        todos: updatedTodos,
      };
    default:
      return state;
  }
};

export const TodoListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todosReducer, { todos: null });

  return (
    <TodoListContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TodoListContext.Provider>
  );
};
