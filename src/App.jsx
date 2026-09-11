import { Routes, Route } from "react-router-dom";

import Loader from "./components/common/Loader";
import ScrollProgress from "./components/common/ScrollProgress";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
// import Experience from "./components/Experience/Experience";
// import Education from "./components/Education/Education";
// import Certificates from "./components/Certificates/Certificates";
// import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import AdminRoutes from "./admin/routes/AdminRoutes";

// 404 NOT FOUND PAGE
import NotFound from "./components/common/NotFound";

// AI CHATBOT
import SantoshAI from "./components/AIChatbot/SantoshAI";

// ========================================
// PUBLIC PORTFOLIO
// ========================================

function Portfolio() {
  return (
    <Loader>
      <ScrollProgress />

      <Navbar />

      <main>
        <Hero />

        <About />

        <Skills />

        <Projects />

        {/* <Experience /> */}

        {/* <Education /> */}

        {/* <Certificates /> */}

        {/* <Contact /> */}
      </main>

      <Footer />

      {/* ========================================
          SANTOSH AI ASSISTANT
      ======================================== */}
      <SantoshAI />
    </Loader>
  );
}

// ========================================
// APP
// ========================================

export default function App() {
  return (
    <Routes>

      {/* ========================================
          PUBLIC PORTFOLIO
      ======================================== */}

      <Route
        path="/"
        element={<Portfolio />}
      />

      {/* ========================================
          ADMIN PANEL
      ======================================== */}

      <Route
        path="/admin/*"
        element={<AdminRoutes />}
      />

      {/* ========================================
          404 NOT FOUND (CATCH-ALL ROUTE)
      ======================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}