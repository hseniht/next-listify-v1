import { TodoListContext } from "../context/TodoListContext";
import { useContext } from "react";

export const useTodosContext = () => {
  //gets all value of that provider
  const context = useContext(TodoListContext);

  if (!context) {
    throw Error("useTodosContext must be used inside its Provider");
  }

  return context;
};
