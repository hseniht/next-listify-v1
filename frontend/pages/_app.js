import "../styles/globals.css";
import "../styles/layout.css";
import Navbar from "../components/ui/navbar";
import { TodoListProvider } from "../context/TodoListContext";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <TodoListProvider>
        <Navbar />
        <Component {...pageProps} />
      </TodoListProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
