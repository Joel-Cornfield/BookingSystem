import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NavBar } from './components/NavBar';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Classes } from './pages/Classes';
import { ClassDetails } from './pages/ClassDetails';
import { Bookings } from './pages/Bookings';
import { Trainers } from './pages/Trainers';
import { TrainerProfile } from './pages/TrainerProfile';
import { Account } from './pages/Account';

// Trainer pages
import { TrainerSessionManager } from './pages/admin/TrainerSessionManager';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageClasses from './pages/admin/ManageClasses';
import ManageSessions from './pages/admin/ManageSessions';
import ManageTrainers from './pages/admin/ManageTrainers';

import './App.css';
import { BookingsProvider } from './context/BookingsContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingsProvider>
          <NavBar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <Classes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:id"
              element={
                <ProtectedRoute>
                  <ClassDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers"
              element={
                <ProtectedRoute>
                  <Trainers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers/:id"
              element={
                <ProtectedRoute>
                  <TrainerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            
            {/* Trainer routes */}
            <Route 
              path="/trainer/sessions"
              element={
                <ProtectedRoute requiredRoles={["Trainer"]}>
                  <TrainerSessionManager />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/classes"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <ManageClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sessions"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <ManageSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/trainers"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <ManageTrainers />
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BookingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
