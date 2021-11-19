import { useRouter } from "next/router";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/authcontext";

import classes from "./Form.module.css";

const LoginForm = function () {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const context = useContext(AuthContext);

  const navigateToSignUp = function (event) {
    event.preventDefault();
    router.push("/signup");
  };

  const login = async function (event) {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await context.login(email, password);
    } catch (err) {
      alert(err.message);
      return;
    }
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
            <p>{`Don't have account?`}</p>
            <button onClick={navigateToSignUp} className={classes.btn}>
              Create Account
            </button>
          </div>
          <form onSubmit={login} className={classes.mainformTwo}>
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
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                  color="#273443"
                >
                  <title id="envelopeAltIconTitle">Envelope</title>
                  <rect width="20" height="14" x="2" y="5" />
                  <path strokeLinecap="round" d="M2 5l10 9 10-9" />
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
                  aria-labelledby="lockAltIconTitle"
                  stroke="#273443"
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
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
                ref={passwordRef}
                className={classes.input}
                placeholder="password"
                type="password"
                minLength="8"
                required
              ></input>
            </div>
            <button className={classes.btn}>login</button>
          </form>
          <div className={classes.mainformThree}></div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
