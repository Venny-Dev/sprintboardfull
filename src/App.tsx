import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import FeatureFlags from "./pages/FeatureFlags";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feature-flags" element={<FeatureFlags />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
