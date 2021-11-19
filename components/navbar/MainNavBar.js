import Link from "next/link";
import router from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authcontext";
import { socket } from "../../pages";
import HamburgerMenu from "./HamburgerMenu";
import classes from "./MainNavBar.module.css";

const MainNavBar = function () {
  const [showHamburgerList, setShowHamburgerList] = useState(false);
  const context = useContext(AuthContext);

  const logOut = async function (event) {
    event.preventDefault();
    socket.emit("leave room", {
      userName: context.userData.userName,
      roomId: context.userData.roomId,
    });
    context.logout();
    router.replace("/");
  };

  const onClickHamburger = function () {
    setShowHamburgerList((oldState) => !oldState);
  };

  return (
    <nav className={classes.mainNavBar}>
      <h1 className={classes.logo}>Baatein</h1>
      {context.currentUser && (
        <ul className={classes.linkList}>
          <li className={classes.linkItem}>
            <Link href="#">friends</Link>
          </li>
          <li className={classes.linkItem}>
            <Link href="#">add friends</Link>
          </li>
          <li className={classes.linkItem}>
            <Link href="#">messanger</Link>
          </li>
          <li className={classes.linkItem}>
            <Link href="/room">room</Link>
          </li>
          <li className={classes.linkItem}>
            <button className={classes.logoutButton} onClick={logOut}>
              logout
            </button>
          </li>
        </ul>
      )}
      {context.currentUser && (
        <HamburgerMenu onClickHamburger={onClickHamburger} />
      )}
      {showHamburgerList && (
        <div className={classes.HamburgerMenuListContainer}>
          <ul className={classes.HamburgerMenuLinkList}>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link href="#">friends</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link href="#">add friends</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link href="#">messanger</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link href="/room">room</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <button
                className={classes.hamburgerLogoutButton}
                onClick={logOut}
              >
                logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MainNavBar;
