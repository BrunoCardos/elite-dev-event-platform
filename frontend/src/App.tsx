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
import ProtectedRoute from './components/ProtectedRoute';

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
          element={
            <ProtectedRoute
              allowedRoles={['CUSTOMER']}
            >
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={<Ticket />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={['ORGANIZER']}
            >
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/new"
          element={
            <ProtectedRoute
              allowedRoles={['ORGANIZER']}
            >
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gatekeeper"
          element={
            <ProtectedRoute
              allowedRoles={['GATEKEEPER']}
            >
              <Gatekeeper />
            </ProtectedRoute>
          }
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