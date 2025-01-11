import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AllClasses from "./pages/AllClasses";
import Session from "./pages/Session";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route
            path="admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="all-classes" element={<AllClasses />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/session/:sessionId"
          element={
            <ProtectedRoutes>
              <Session />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
