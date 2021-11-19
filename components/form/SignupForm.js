import { useRouter } from "next/router";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/authcontext";
import classes from "./Form.module.css";

const SignUpForm = function () {
  const router = useRouter();
  const context = useContext(AuthContext);

  const emailRef = useRef();
  const newPasswordRef = useRef();
  const confirmedPasswordRef = useRef();
  const userNameRef = useRef();

  const navigateToLogin = function (event) {
    event.preventDefault();
    router.push("/login");
  };

  const signUp = async function (event) {
    event.preventDefault();

    const email = emailRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmedPassword = confirmedPasswordRef.current.value;
    const userName = userNameRef.current.value;

    if (confirmedPassword !== newPassword) {
      alert("new password and confirm passsword must be same.");
      return;
    }

    await context.signup(email, userName, confirmedPassword);
    router.replace("home-page");
  };

  return (
    <div className={classes.formMegaContainer}>
      <div className={classes.formContainer}>
        <div className={classes.introCard}>
          <h1>Baatein</h1>
        </div>
        <div className={classes.mainform}>
          <div className={classes.mainformOne}>
            <p>Already have account?</p>
            <button onClick={navigateToLogin} className={classes.btn}>
              login to account
            </button>
          </div>
          <form onSubmit={signUp} className={classes.mainformTwo}>
            <div className={classes.inputContainer}>
              <span className={classes.inputIccon}>
                <svg
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  aria-labelledby="envelopeAltIconTitle"
                  stroke="#273443"
                  stroke-width="1"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  fill="none"
                  color="#273443"
                >
                  <title id="envelopeAltIconTitle">Envelope</title>
                  <rect width="20" height="14" x="2" y="5" />
                  <path stroke-linecap="round" d="M2 5l10 9 10-9" />
                </svg>
              </span>
              <input
                ref={emailRef}
                className={classes.input}
                type="email"
                placeholder="email"
                required
              ></input>
            </div>
            <div className={classes.inputContainer}>
              <span className={classes.inputIccon}>
                <svg
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  aria-labelledby="personIconTitle"
                  stroke="#273443"
                  stroke-width="1"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  fill="none"
                  color="#273443"
                >
                  {" "}
                  <title id="personIconTitle">Person</title>{" "}
                  <path d="M4,20 C4,17 8,17 10,15 C11,14 8,14 8,9 C8,5.667 9.333,4 12,4 C14.667,4 16,5.667 16,9 C16,14 13,14 14,15 C16,17 20,17 20,20" />{" "}
                </svg>
              </span>
              <input
                ref={userNameRef}
                className={classes.input}
                type="text"
                placeholder="user name"
                required
              ></input>
            </div>
            <div className={classes.inputContainer}>
              <span className={classes.inputIccon}>
                <svg
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  aria-labelledby="lockAltIconTitle"
                  stroke="#273443"
                  stroke-width="1"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  fill="none"
                  color="#273443"
                >
                  {" "}
                  <title id="lockAltIconTitle">Lock</title>{" "}
                  <rect width="14" height="10" x="5" y="11" />{" "}
                  <path d="M12,3 L12,3 C14.7614237,3 17,5.23857625 17,8 L17,11 L7,11 L7,8 C7,5.23857625 9.23857625,3 12,3 Z" />{" "}
                  <circle cx="12" cy="16" r="1" />{" "}
                </svg>
              </span>
              <input
                ref={newPasswordRef}
                className={classes.input}
                placeholder="new password"
                type="password"
                minLength="8"
                required
              ></input>
            </div>
            <div className={classes.inputContainer}>
              <span className={classes.inputIccon}>
                <svg
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  aria-labelledby="circleOkIconTitle"
                  stroke="#273443"
                  stroke-width="1"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  fill="none"
                  color="#273443"
                >
                  {" "}
                  <title id="circleOkIconTitle">OK</title>{" "}
                  <polyline points="7 13 10 16 17 9" />{" "}
                  <circle cx="12" cy="12" r="10" />{" "}
                </svg>
              </span>
              <input
                ref={confirmedPasswordRef}
                className={classes.input}
                placeholder="confirm password"
                type="password"
                minLength="8"
                required
              ></input>
            </div>
            <button className={classes.btn}>sign up</button>
          </form>
          <div className={classes.mainformThree}></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
