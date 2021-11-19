import SignUpForm from "../../components/form/SignupForm";
import classes from "./index.module.css";

const SignUp = function () {
  return (
    <div className={classes.mainBody}>
      <SignUpForm />
    </div>
  );
};
export default SignUp;
