import LoginForm from "../../components/form/LogInForm";

import classes from "./index.module.css";

const Login = function () {
  return (
    <div className={classes.mainBody}>
      <LoginForm />
    </div>
  );
};
export default Login;
