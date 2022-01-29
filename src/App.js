import AppRouter from "./AppRouter";
import MainNavBar from "./components/navbar/MainNavBar";

export const NOTIFICATION = {
  0: "new friend request",
  1: "friend request canceled",
  2: "friend request accepted",
  3: "friend request rejected",
  4: "new personal message",
};
export const APP_USERS = {};

function App() {
  return (
    <div className="mainBody">
      <MainNavBar />
      <AppRouter />
    </div>
  );
}

export default App;
