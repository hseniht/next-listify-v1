import { useEffect, useState } from "react";
import Link from "next/link";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Menu, Button } from "antd";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  // const currentPath = router.pathname;
  const [current, setCurrent] = useState(router.pathname);

  useEffect(() => {
    setCurrent(router.pathname);
  }, [router.pathname]);

  const handleClick = () => {
    logout();
  };
  const onClick = (e) => {
    console.log("menu clicked ", e);
    // setCurrent(e.key);
  };

  const menuItems = [
    {
      label: <Link href={"/"}>Home</Link>,
      key: "/",
    },
    {
      label: <Link href={"/list"}>Dashboard</Link>,
      key: "/list",
    },
    {
      label: <Link href={"/login"}>Login</Link>,
      key: "/login",
      className: "klass",
      hidden: true,
    },
    {
      label: <Link href={"/signup"}>SignUp</Link>,
      key: "/signup",
    },
  ];
  let displayMenu = menuItems;
  // if logged in, then remove 'signup' and 'login' from menu
  if (user) {
    displayMenu = menuItems.filter(
      (item) => item.key !== "/login" && item.key !== "/signup"
    );
  } else {
    displayMenu = menuItems.filter((item) => item.key !== "/list");
  }

  return (
    <header id="mainHeader">
      <div id="mainNavigation" className="main-menu">
        <div className="brand-container">Logo</div>
        <nav className={"main-menu__nav"}>
          <Menu
            // onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={displayMenu}
          />
          {user && (
            <div className="main-menu__status_menu">
              <div>{user.email}</div>
              <Button type="text" size="small" onClick={handleClick}>
                Log out
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
