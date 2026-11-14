import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { homeByRole } from "./data/mock";
import GuestLayout from "./components/GuestLayout";
import Layout from "./components/Layout";
import Landing from "./pages/guest/Landing";
import Register from "./pages/guest/Register";
import Login from "./pages/guest/Login";
import FirstLogin from "./pages/guest/FirstLogin";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import MyDay from "./pages/worker/MyDay";
import WorkConditions from "./pages/worker/WorkConditions";
import TaskDetails from "./pages/worker/TaskDetails";
import ReportIncident from "./pages/worker/ReportIncident";
import RiskDashboard from "./pages/supervisor/RiskDashboard";
import Worksites from "./pages/supervisor/Worksites";
import ShiftPlanner from "./pages/supervisor/ShiftPlanner";
import Checklist from "./pages/supervisor/Checklist";
import LiveBoard from "./pages/supervisor/LiveBoard";
import Incidents from "./pages/supervisor/Incidents";
import Reports from "./pages/supervisor/Reports";
import Users from "./pages/admin/Users";
import SafetyRules from "./pages/admin/SafetyRules";

// Only lets the given role through, others go to their own home page
function RoleRoute({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? <Outlet /> : <Navigate to={homeByRole[user.role]} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/first-login" element={<FirstLogin />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/report-incident" element={<ReportIncident />} />

        <Route element={<RoleRoute role="worker" />}>
          <Route path="/my-day" element={<MyDay />} />
          <Route path="/conditions" element={<WorkConditions />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Route>

        <Route element={<RoleRoute role="supervisor" />}>
          <Route path="/dashboard" element={<RiskDashboard />} />
          <Route path="/worksites" element={<Worksites />} />
          <Route path="/planner" element={<ShiftPlanner />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/live-board" element={<LiveBoard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route element={<RoleRoute role="admin" />}>
          <Route path="/users" element={<Users />} />
          <Route path="/safety-rules" element={<SafetyRules />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
