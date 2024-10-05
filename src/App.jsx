import { Suspense, lazy } from "react";
import Loading from "./Loading";
import "./styles/app.css";
import "./styles/scrollbar.css";

const Root = lazy(() => import("/src/main/Root"));

function App() {
  return (
    <Suspense fallback={<Loading text="..." />}>
      <Root />
    </Suspense>
  );
}

export default App
