import { Navbar } from "./components/Navbar/Navbar";
import { AppRoutes } from "./routes/AppRoutes";
import { RouteTransitionProvider } from "./routes/RouteTransitionContext";

//import { useScrollSmoother } from "../src/animations/hooks/useScrollSmoother";

function App() {
  //useScrollSmoother();

  return (
    <RouteTransitionProvider>

      <div id="smooth-wrapper">
        <div id="smooth-content">

          <Navbar />

          <AppRoutes />

        </div>
      </div>

    </RouteTransitionProvider>
  );
}

export default App;