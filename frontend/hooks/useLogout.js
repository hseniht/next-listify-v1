import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const logout = () => {
    // clear the token and local state
    localStorage.removeItem("user");

    //dispatch logout action
    dispatch({ type: "LOGOUT" }); // no need payload in this case
  };

  return { logout };
};
