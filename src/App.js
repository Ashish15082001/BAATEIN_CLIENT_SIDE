import AppRouter from "./AppRouter";
import MainNavBar from "./components/navbar/MainNavBar";

function App() {
  return (
    <div className="mainBody">
      <MainNavBar />
      <AppRouter />
    </div>
  );
}

export default App;
