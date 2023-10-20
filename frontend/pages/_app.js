import "../styles/globals.css";
import "../styles/layout.css";
import { TodoListProvider } from "../context/TodoListContext";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <TodoListProvider>
        <Component {...pageProps} />
      </TodoListProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
