import { chakra } from "@chakra-ui/system";
import React from "react";
import { useAuth } from "../context/authcontext";

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <React.Fragment>
      <div style={{ width: "100%", overflowX: 'hidden' }}>
        <h1>inside home page</h1>
        <chakra.pre>
          <p>{JSON.stringify(currentUser, null, 2)}</p>
        </chakra.pre>
      </div>
    </React.Fragment>
  );
}
