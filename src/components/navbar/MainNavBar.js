import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import classes from "./MainNavBar.module.css";
import { useAuth } from "../../context/authcontext";
import { Badge } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";

const MainNavBar = function () {
  const [showHamburgerList, setShowHamburgerList] = useState(false);
  const { signout, currentUserDetails } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const logOut = async function (event) {
    event.preventDefault();

    if (isSigningOut) return;

    setIsSigningOut(true);
    signout()
      .then(() => {
        setIsSigningOut(false);
        navigate("/login");
      })
      .catch(() => {});
  };

  const onClickHamburger = function () {
    setShowHamburgerList((oldState) => !oldState);
  };

  return (
    <nav className={classes.mainNavBar}>
      <h1 className={classes.logo} onClick={() => navigate("/home-page")}>
        Baatein<Badge colorScheme="purple">alpha</Badge>
      </h1>

      {currentUserDetails && (
        <ul className={classes.linkList}>
          <li className={classes.linkItem}>
            <Link to="#">friends</Link>
          </li>
          <li className={classes.linkItem}>
            <Link to="/home-page/add-friends">add friends</Link>
          </li>
          <li className={classes.linkItem}>
            <Link to="/home-page/messenger-page">messenger</Link>
          </li>
          <li className={classes.linkItem}>
            <Link to="/home-page/room">room</Link>
          </li>
          <li className={classes.linkItem}>
            <Menu>
              <MenuButton
                className={classes.menuButton}
                style={{
                  backgroundColor: "#273443",
                  border: "1px solid white",
                }}
                as={Button}
              >
                Profile
              </MenuButton>
              <MenuList style={{ backgroundColor: "#273443" }}>
                <MenuItem className={classes.menuItem}>my profile</MenuItem>
                <MenuItem className={classes.menuItem}>
                  friend requests
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  pending friend requests
                </MenuItem>
                <MenuItem className={classes.menuItem}>settings</MenuItem>
                <MenuItem className={classes.menuItem} onClick={logOut}>
                  logout
                </MenuItem>
              </MenuList>
            </Menu>
          </li>
        </ul>
      )}

      {currentUserDetails && (
        <HamburgerMenu onClickHamburger={onClickHamburger} />
      )}

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
              <Link to="/">logout</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MainNavBar;
