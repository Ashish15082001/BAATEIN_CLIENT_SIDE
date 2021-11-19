import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

export default function homePage() {
  const context = useContext(AuthContext);

  console.log(context);

  return (
    <div>
      <h1>homePage</h1>
    </div>
  );
}
