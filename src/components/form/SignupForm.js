import { useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authcontext";
import classes from "./Form.module.css";
import { Button } from "@chakra-ui/react";

const SignUpForm = function () {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  const toastIdRef = useRef();
  const toast = useToast();
  const { register } = useAuth();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onEmailChange = function (event) {
    setEmail(event.target.value);
  };
  const onNewPasswordChange = function (event) {
    setNewPassword(event.target.value);
  };
  const onConfirmedPasswordChange = function (event) {
    setConfirmedPassword(event.target.value);
  };
  const onUserNameChange = function (event) {
    setUserName(event.target.value);
  };

  const navigateToLogin = function (event) {
    event.preventDefault();
    navigate("/login");
  };

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const signUp = async function (event) {
    event.preventDefault();

    if (isSigningUp) return;
    close();

    if (
      email === "" ||
      userName === "" ||
      newPassword === "" ||
      confirmedPassword === ""
    ) {
      toastIdRef.current = toast({
        description: "all fields are compulsary",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmedPassword) {
      toastIdRef.current = toast({
        description: "newPassword and confirmedPassword must be same.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    setIsSigningUp(true);
    register(email, newPassword)
      .then((Response) => {
        console.log(Response);
        toastIdRef.current = toast({
          description: "successfully signedup in.",
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
      })
      .finally(() => {
        isMounted.current && setIsSigningUp(false);
      });
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
            <Button
              onClick={navigateToLogin}
              colorScheme="teal"
              variant="solid"
            >
              log in
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
                  aria-labelledby="personIconTitle"
                  stroke="#273443"
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                  color="#273443"
                >
                  {" "}
                  <title id="personIconTitle">Person</title>{" "}
                  <path d="M4,20 C4,17 8,17 10,15 C11,14 8,14 8,9 C8,5.667 9.333,4 12,4 C14.667,4 16,5.667 16,9 C16,14 13,14 14,15 C16,17 20,17 20,20" />{" "}
                </svg>
              </span>
              <input
                onChange={onUserNameChange}
                value={userName}
                className={classes.input}
                type="text"
                placeholder="user name"
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
                onChange={onNewPasswordChange}
                value={newPassword}
                className={classes.input}
                placeholder="new password"
                type="password"
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
                  strokeWidth="1"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
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
                onChange={onConfirmedPasswordChange}
                value={confirmedPassword}
                className={classes.input}
                placeholder="confirm password"
                type="password"
              ></input>
            </div>
            <Button
              onClick={signUp}
              isLoading={isSigningUp}
              colorScheme="teal"
              variant="solid"
              loadingText="signing up"
            >
              sign up
            </Button>
          </form>
          <div className={classes.mainformThree}></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
