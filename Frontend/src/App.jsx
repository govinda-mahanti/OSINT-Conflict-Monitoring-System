import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import DashLayout from "./Dashboard/DashLayout";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<DashLayout />}>
            <Route index element={<Dashboard />} />
         
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
