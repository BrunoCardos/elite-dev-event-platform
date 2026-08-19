import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './pages/Login';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Checkout from './pages/Checkout';
import Ticket from './pages/Ticket';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEvent from './pages/CreateEvent';
import Gatekeeper from './pages/Gatekeeper';
import MyTickets from './pages/MyTickets';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
  path="/tickets"
  element={<MyTickets />}
/>

        <Route
          path="/tickets/:id"
          element={<Ticket />}
        />

        <Route
  path="/admin"
  element={<OrganizerDashboard />}
/>

<Route
  path="/admin/events/new"
  element={<CreateEvent />}
/>

<Route
  path="/gatekeeper"
  element={<Gatekeeper />}
/>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;