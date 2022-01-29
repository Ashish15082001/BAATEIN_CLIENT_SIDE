import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import classes from "./MainNavBar.module.css";
import { useAuth } from "../../context/authcontext";
import { Badge } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { NotificationDrawer } from "../drawers/NotificationDrawer";

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

  let x;

  console.log("x = ", x);

  if (!currentUserDetails) return null;
  return (
    <nav className={classes.mainNavBar}>
      <h1 className={classes.logo} onClick={() => navigate("/home-page")}>
        Baatein<Badge colorScheme="purple">alpha</Badge>
      </h1>

      <ul className={classes.linkList}>
        <li className={classes.linkItem}>
          <Link to="/home-page/add-friends">
            <Tooltip
              hasArrow
              label="add new friends"
              bg="gray.300"
              color="black"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 23.75H2.5C2.5 19.6079 5.85786 16.25 10 16.25C14.1421 16.25 17.5 19.6079 17.5 23.75H15C15 20.9886 12.7614 18.75 10 18.75C7.23858 18.75 5 20.9886 5 23.75ZM23.75 20H21.25V16.25H17.5V13.75H21.25V10H23.75V13.75H27.5V16.25H23.75V20ZM10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10C14.9966 12.76 12.76 14.9966 10 15ZM10 7.5C8.63424 7.50138 7.52236 8.59856 7.50279 9.96418C7.48322 11.3298 8.56321 12.4584 9.92836 12.4989C11.2935 12.5394 12.4385 11.4769 12.5 10.1125V10.6125V10C12.5 8.61929 11.3807 7.5 10 7.5Z"
                  fill="white"
                />
              </svg>
            </Tooltip>
          </Link>
        </li>
        <li className={classes.linkItem}>
          <Link to="/home-page/messenger-page">
            <Tooltip hasArrow label="messenger" bg="gray.300" color="black">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 5V22.5L8.5 18C8.93227 17.6745 9.45891 17.499 10 17.5H20C21.3807 17.5 22.5 16.3807 22.5 15V5C22.5 3.61929 21.3807 2.5 20 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5ZM5 17.5V5H20V15H9.1675C8.62634 14.9985 8.09956 15.1741 7.6675 15.5L5 17.5Z"
                  fill="white"
                />
                <path
                  d="M27.5 27.5V11.25C27.5 9.86929 26.3807 8.75 25 8.75V22.5L22.3325 20.5C21.9004 20.1741 21.3737 19.9985 20.8325 20H8.75C8.75 21.3807 9.86929 22.5 11.25 22.5H20C20.5411 22.499 21.0677 22.6746 21.5 23L27.5 27.5Z"
                  fill="white"
                />
              </svg>
            </Tooltip>
          </Link>
        </li>
        <li className={classes.linkItem}>
          <Link to="/home-page/room">
            <Tooltip
              hasArrow
              label="create/join room"
              bg="gray.300"
              color="black"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 25H6.25C5.55964 25 5 24.4404 5 23.75V13.925C5 13.6008 5.12595 13.2893 5.35125 13.0563L12.2263 5.93126C12.4618 5.68722 12.7864 5.54938 13.1256 5.54938C13.4648 5.54938 13.7894 5.68722 14.025 5.93126L16.0888 8.07251L14.2975 9.81501L13.125 8.60001L7.5 14.425V22.4938H21.25V23.7438C21.2517 24.0764 21.1207 24.3959 20.8861 24.6317C20.6515 24.8675 20.3326 25 20 25ZM21.25 20H18.75V16.25H15V13.75H18.75V10H21.25V13.75H25V16.25H21.25V20Z"
                  fill="white"
                />
              </svg>
            </Tooltip>
          </Link>
        </li>
        <li className={classes.linkItem} style={{ cursor: "pointer" }}>
          <NotificationDrawer />
        </li>
        <li className={classes.linkItem} style={{ cursor: "pointer" }}>
          <Tooltip hasArrow label="tutorial/help" bg="gray.300" color="black">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.4924 21.9004 21.9004 27.4924 15 27.5ZM5 15.215C5.05915 20.7166 9.55138 25.1369 15.0532 25.1075C20.555 25.0778 24.9994 20.6094 24.9994 15.1075C24.9994 9.60563 20.555 5.13722 15.0532 5.1075C9.55138 5.07807 5.05915 9.49845 5 15V15.215ZM17.5 21.25H13.75V16.25H12.5V13.75H16.25V18.75H17.5V21.25ZM16.25 11.25H13.75V8.75H16.25V11.25Z"
                fill="white"
              />
            </svg>
          </Tooltip>
        </li>
        <li className={classes.linkItem}>
          <Menu>
            <MenuButton
              className={classes.menuButton}
              style={{
                backgroundColor: "white",
                color: "rgb(39, 52, 67)",
                border: "1px solid white",
              }}
              as={Button}
            >
              Profile
            </MenuButton>
            <MenuList style={{ color: "rgb(39, 52, 67)" }}>
              <MenuItem>my profile</MenuItem>
              <MenuItem>settings</MenuItem>
              <MenuItem onClick={logOut}>logout</MenuItem>
            </MenuList>
          </Menu>
        </li>
      </ul>

      <HamburgerMenu onClickHamburger={onClickHamburger} />

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
    </nav>
  );
};

export default MainNavBar;
