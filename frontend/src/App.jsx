import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Dashboard
import UserDashboard from "./pages/dashboard/UserDashboard";

// Organizer Dashboard
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";

// Admin Dashboard & Subpages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryManagement from "./pages/admin/CategoryManagement";
import CityManagement from "./pages/admin/CityManagement";
import VenueManagement from "./pages/admin/VenueManagement";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/event/:slug" element={<EventDetails />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Dashboard Routes */}
          <Route element={<DashboardLayout role="user" />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/tickets" element={<UserDashboard />} />
            <Route path="/dashboard/favorites" element={<UserDashboard />} />
            <Route path="/dashboard/profile" element={<UserDashboard />} />
          </Route>

          {/* Organizer Dashboard Routes */}
          <Route element={<DashboardLayout role="organizer" />}>
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/events" element={<OrganizerDashboard />} />
            <Route path="/organizer/create-event" element={<CreateEvent />} />
            <Route path="/organizer/events/new" element={<CreateEvent />} />
            <Route path="/organizer/registrations" element={<OrganizerDashboard />} />
            <Route path="/organizer/analytics" element={<OrganizerDashboard />} />
            <Route path="/organizer/profile" element={<OrganizerDashboard />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/moderation" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/cities" element={<CityManagement />} />
            <Route path="/admin/venues" element={<VenueManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
