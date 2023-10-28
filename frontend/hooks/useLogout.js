import { useAuthContext } from "./useAuthContext";
import { useTodosContext } from "./useTodoListContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: todosDispatch } = useTodosContext();
  const logout = () => {
    // clear the token and local state
    localStorage.removeItem("user");

    //dispatch logout action
    dispatch({ type: "LOGOUT" }); // no need payload in this case

    // Clear the local state (lists) after logout, otherwise
    // we might see it linger around when login back.
    todosDispatch({ type: "SET_TODOS", payload: null });
  };

  return { logout };
};
