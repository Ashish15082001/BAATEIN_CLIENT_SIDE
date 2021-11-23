import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import classes from "./MainNavBar.module.css";
import { useAuth } from "../../context/authcontext";

const MainNavBar = function () {
  const [showHamburgerList, setShowHamburgerList] = useState(false);
  const { signout, currentUser } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const logOut = async function (event) {
    event.preventDefault();

    if (isSigningOut) return;

    setIsSigningOut(true);
    // socket.emit("leave room", {
    //   userName: context.userData.userName,
    //   roomId: context.userData.roomId,
    // });
    signout()
      .then((response) => {
        navigate("/login");
      })
      .catch((err) => {});
  };

  const onClickHamburger = function () {
    setShowHamburgerList((oldState) => !oldState);
  };

  return (
    <nav className={classes.mainNavBar}>
      <h1 className={classes.logo}>Baatein</h1>

      {currentUser && (
        <ul className={classes.linkList}>
          <li className={classes.linkItem}>
            <Link to="#">friends</Link>
          </li>
          <li className={classes.linkItem}>
            <Link to="#">add friends</Link>
          </li>
          <li className={classes.linkItem}>
            <Link to="#">messanger</Link>
          </li>
          <li className={classes.linkItem}>
            <Link to="/home-page/room">room</Link>
          </li>
          <li className={classes.linkItem}>
            <button className={classes.logoutButton} onClick={logOut}>
              logout
            </button>
          </li>
        </ul>
      )}

      {currentUser && <HamburgerMenu onClickHamburger={onClickHamburger} />}

      {showHamburgerList && (
        <div className={classes.HamburgerMenuListContainer}>
          <ul className={classes.HamburgerMenuLinkList}>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link to="#">friends</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link to="#">add friends</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link to="#">messanger</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
              <Link to="/home-page/room">room</Link>
            </li>
            <li className={classes.HamburgerMenuLlinkItem}>
            <button className={classes.logoutButton} onClick={logOut}>
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
