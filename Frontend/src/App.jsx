import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import DashLayout from "./Dashboard/DashLayout";
import Dashboard from "./Dashboard/Dashboard";
import ExecutiveSummary from "./Dashboard/ExecutiveSummary";
import EventFeed from "./Dashboard/EventFeed";
import MapView from "./Dashboard/MapView";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<DashLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="executive-summary" element={<ExecutiveSummary />} />
            <Route path="event-feed" element={<EventFeed />} />
            <Route path="map-view" element={<MapView />} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
