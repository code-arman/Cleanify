import Login from "./pages/Login";
import Home from "./pages/Home";
import GlobalContextProvider from "./contexts/GlobalContext";
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <GlobalContextProvider>
      {code ? <Home code={code} /> : <Login />}
    </GlobalContextProvider>
  );
}

export default App;
