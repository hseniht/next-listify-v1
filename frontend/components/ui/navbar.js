import Link from "next/link";
import { useLogout } from "../../hooks/useLogout";

const Navbar = () => {
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <header id="mainHeader">
      <div id="mainNavigation" className="container">
        <div className="brand-container">Logo</div>
        <nav className="main-menu">
          <ul>
            <li className="menu-item">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="menu-item">
              <Link href={"/list"}>List</Link>
            </li>
            <li className="menu-item">
              <button onClick={handleClick}>Log out</button>
            </li>
            <li className="menu-item">
              <Link href={"/login"}>Login</Link>
            </li>
            <li className="menu-item">
              <Link href={"/signup"}>Sign Up</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
