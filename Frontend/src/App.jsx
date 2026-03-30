import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import DashLayout from "./Dashboard/DashLayout";
import Dashboard from "./Dashboard/Dashboard";
import ConflictNexus from "./Dashboard/ConflictNexus";
import EventFeed from "./Dashboard/EventFeed";
import MapView from "./Dashboard/MapView";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<DashLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="intel-feed" element={<ConflictNexus />} />
            <Route path="event-feed" element={<EventFeed />} />
            <Route path="map-view" element={<MapView />} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
