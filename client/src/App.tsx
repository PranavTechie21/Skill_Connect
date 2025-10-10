import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/home";
import ProfileRedirect from "./pages/profile-redirect";
import NotFound from "./pages/not-found";
import Navbar from "./components/navbar";
import EmployeeLayout from "./components/layouts/EmployeeLayout";
import OurStories from "./pages/our-stories";
import ProfessionalsPage from "./pages/professionals";
import Jobs from "./pages/jobs";
import About from "./pages/about";
import Admin from "./pages/admin";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboards from "./pages/dashboards";
import EmployeeHome from "./pages/employee-home";
import EmployerHome from "./pages/employer-home";
import Applications from "./pages/applications";
import { AuthProvider } from "./contexts/AuthContext";
import SubmitStory from "./pages/submit-story";
import { ProtectedRoute } from "./components/ProtectedRoute"; // ensure this exists

export default function App() {
  // `useLocation` must be used inside a Router. Create a child component
  // that consumes it and renders the rest of the app.
  function AppContent() {
    const location = useLocation();

    return (
      <div className="min-h-screen flex flex-col">
        {/* Hide global Navbar on employee dashboard routes to show specialized layout */}
        {!(location.pathname.startsWith("/employee")) && <Navbar />}
        <main className="flex-1 pt-20">
          <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProfileRedirect />} />
              <Route path="/our-stories" element={<OurStories />} />
              <Route path="/professionals" element={<ProfessionalsPage />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/dashboards" element={<Dashboards />} />
              <Route path="/submit-story" element={<SubmitStory />} />

              {/* Employee & Employer - protected dashboard routes */}
              <Route path="/employee/dashboard" element={<Navigate to="/employee/home" replace />} />
              <Route
                path="/employee/home"
                element={
                  <ProtectedRoute allowedUserTypes={["Professional"]}>
                    <EmployeeLayout>
                      <EmployeeHome />
                    </EmployeeLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/employer/dashboard" element={<Navigate to="/employer/home" replace />} />
              <Route
                path="/employer/home"
                element={
                  <ProtectedRoute allowedUserTypes={["Employer"]}>
                    <EmployerHome />
                  </ProtectedRoute>
                }
              />

              {/* Helpful redirects so shallow paths don't 404 */}
              <Route path="/employee" element={<Navigate to="/employee/home" replace />} />
              <Route path="/employer" element={<Navigate to="/employer/home" replace />} />

              {/* 404 */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
