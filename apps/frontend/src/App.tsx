import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AllClasses from "./pages/AllClasses";
import Session from "./pages/Session";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard/admin" element={<Admin />} />
            <Route path="/dashboard/all-classes" element={<AllClasses />} />
          </Route>
          <Route path="/session/:sessionId" element={<Session />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
