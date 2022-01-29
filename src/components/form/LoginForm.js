import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import classes from "./Form.module.css";
import { Button, useToast } from "@chakra-ui/react";
import { useAuth } from "../../context/authcontext";
import { animated } from "react-spring";

const LoginForm = function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const toastIdRef = useRef();
  const toast = useToast();
  const { signIn, forgotPassword } = useAuth();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const onEmailChange = function (event) {
    setEmail(event.target.value);
  };

  const onPasswordChange = function (event) {
    setPassword(event.target.value);
  };

  const navigateToSignUp = function (event) {
    event.preventDefault();
    navigate("/signup");
  };

  const login = async function (event) {
    event.preventDefault();

    if (isSigningIn) return;
    close();

    if (email === "" || password === "") {
      toastIdRef.current = toast({
        description: "All fields are compulsary",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    } else if (password.length < 8) {
      toastIdRef.current = toast({
        description: "password length must be >= 8",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsSigningIn(true);

    signIn(email, password)
      .then(() => {
        toastIdRef.current = toast({
          description: "logged in successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/home-page");
      })
      .catch((err) => {
        toastIdRef.current = toast({
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSigningIn(false);
      });
  };

  const onForgotPassword = async function (event) {
    event.preventDefault();

    if (email) {
      close();
      forgotPassword(email)
        .then(() => {
          toastIdRef.current = toast({
            description: "password reset email sent.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((err) => {
          close();
          toastIdRef.current = toast({
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else if (!email) {
      close();
      toastIdRef.current = toast({
        description: "please enter your email to reset password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <animated.div className={classes.formMegaContainer}>
      <div className={classes.formContainer}>
        <div className={classes.introCard}></div>
        <div className={classes.mainform}>
          <div className={classes.mainformOne}>
            <p>{`Don't have account?`}</p>
            <Button
              onClick={navigateToSignUp}
              colorScheme="teal"
              variant="solid"
            >
              create account
            </Button>
          </div>
          <form className={classes.mainformTwo}>
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
                onChange={onEmailChange}
                value={email}
                className={classes.input}
                type="email"
                placeholder="email"
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
                onChange={onPasswordChange}
                value={password}
                className={classes.input}
                placeholder="password"
                type="password"
              ></input>
            </div>
            <Button
              onClick={login}
              isLoading={isSigningIn}
              colorScheme="teal"
              variant="solid"
              loadingText="logging in"
            >
              log in
            </Button>
          </form>
          <div className={classes.mainformThree}>
            <p onClick={onForgotPassword}> forgot passsword ?</p>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default LoginForm;
