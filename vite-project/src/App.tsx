import { Navbar } from "./components/Navbar/Navbar";
import { AppRoutes } from "./routes/AppRoutes";
import { RouteTransitionProvider } from "./routes/RouteTransitionContext";

function App() {
  return (
    <RouteTransitionProvider>
      <Navbar />
      <AppRoutes />
    </RouteTransitionProvider>
  );
}

export default App;