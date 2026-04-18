import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/layout/Layout";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import CreateEventPage from "./pages/CreateEventPage";
import DashboardPage from "./pages/DashboardPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventsPage from "./pages/EventsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MapPage from "./pages/MapPage";

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <>
      <Routes>
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
          <Route path="create" element={<CreateEventPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}
