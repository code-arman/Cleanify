import Login from "./pages/Login";
import Home from "./pages/Home";
import GlobalContextProvider from "./contexts/GlobalContext";
import posthog from "posthog-js";
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  posthog.init("phc_7Gvql0kYGkwkTNkMOdnbi52JiYR8kJFQ3oBt5zKIc1L", {
    api_host: "https://us.i.posthog.com",
  });

  return (
    <GlobalContextProvider>
      {code ? <Home code={code} /> : <Login />}
    </GlobalContextProvider>
  );
}

export default App;
