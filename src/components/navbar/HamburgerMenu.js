import classes from "./HamburgerMenu.module.css";

const HamburgerMenu = function (props) {
  return (
    <div onClick={props.onClickHamburger} className={classes.hamburger}>
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="32px"
        height="32px"
        viewBox="0 0 24 24"
        aria-labelledby="hamburgerIconTitle"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        color="#ffffff"
      >
        <title id="hamburgerIconTitle">Menu</title>
        <path d="M6 7L18 7M6 12L18 12M6 17L18 17" />
      </svg>
    </div>
  );
};

export default HamburgerMenu;
