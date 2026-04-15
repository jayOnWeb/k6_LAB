import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import RunTest from "./pages/RunTest";
import History from "./pages/History";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout Wrapper */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="run-test" element={<RunTest />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;