import { Routes, Route, Navigate } from "react-router-dom";

// ======================================================
// ADMIN PAGES
// ======================================================

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Hero from "../pages/Hero";
import About from "../pages/About";
import Skills from "../pages/Skills";
import Projects from "../pages/Projects";
import Certificates from "../pages/Certificates";
import Experience from "../pages/Experience";
import Education from "../pages/Education";
import Resume from "../pages/Resume";

// ======================================================
// ADMIN COMPONENTS / AUTH
// ======================================================

import ProtectedRoute from "./ProtectedRoute";

// ======================================================
// ADMIN ROUTES
// ======================================================

export default function AdminRoutes() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* HERO */}
      <Route
        path="/hero"
        element={
          <ProtectedRoute>
            <Hero />
          </ProtectedRoute>
        }
      />

      {/* ABOUT */}
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />

      {/* SKILLS */}
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <Skills />
          </ProtectedRoute>
        }
      />

      {/* PROJECTS */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      {/* EXPERIENCE */}
      <Route
        path="/experience"
        element={
          <ProtectedRoute>
            <Experience />
          </ProtectedRoute>
        }
      />

      {/* EDUCATION */}
      <Route
        path="/education"
        element={
          <ProtectedRoute>
            <Education />
          </ProtectedRoute>
        }
      />

      {/* CERTIFICATES */}
      <Route
        path="/certificates"
        element={
          <ProtectedRoute>
            <Certificates />
          </ProtectedRoute>
        }
      />

      {/* RESUME */}
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ADMIN ROUTE (Fixed redirect path) */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}