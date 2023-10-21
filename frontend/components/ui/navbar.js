import Link from "next/link";

const Navbar = () => {
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
