import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AllClasses from "./pages/AllClasses";
import Session from "./pages/Session";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import { useRecoilValue } from "recoil";
import { currUser, userRole } from "./recoil";
import ProtectedRoutes from "./components/ProtectedRoutes";

export default function App() {
  const User = useRecoilValue(currUser);
  const Role = useRecoilValue(userRole);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes currUser={User}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          {Role === "admin" && <Route path="admin" element={<Admin />} />}
          <Route path="all-classes" element={<AllClasses />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/session/:sessionId"
          element={
            <ProtectedRoutes currUser={User}>
              <Session />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
