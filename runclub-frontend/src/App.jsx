import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import SplashScreen from "./components/ui/SplashScreen";
import { RouteSkeleton } from "./components/ui";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import CreateEventPage from "./pages/CreateEventPage";
import DashboardPage from "./pages/DashboardPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventsPage from "./pages/EventsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MapPage from "./pages/MapPage";
import UserProfilePage from "./pages/UserProfilePage";

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-6 md:px-6"><RouteSkeleton /></div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-6 md:px-6"><RouteSkeleton title="Preparing the welcome flow" /></div>;
  }

  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <Routes key="app">
          <Route
            path="/auth"
            element={
              <PublicOnly>
                <AuthPage />
              </PublicOnly>
            }
          />

          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="user/:userId" element={<UserProfilePage />} />
            <Route path="create" element={<CreateEventPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </AnimatePresence>
  );
}
