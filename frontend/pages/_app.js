import "../styles/globals.css";
import "../styles/layout.css";
import { TodoListProvider } from "../context/TodoListContext";

function MyApp({ Component, pageProps }) {
  return (
    <TodoListProvider>
      <Component {...pageProps} />
    </TodoListProvider>
  );
}

export default MyApp;
