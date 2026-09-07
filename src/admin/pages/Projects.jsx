import { useState } from "react";

import Layout from "../components/Layout";
import ProjectsForm from "../components/ProjectsForm";
import ProjectsList from "../components/ProjectsList";

export default function Projects() {
  // ========================================
  // REFRESH STATE
  // ========================================

  const [refresh, setRefresh] = useState(0);

  // ========================================
  // EDITING PROJECT
  // ========================================

  const [editingProject, setEditingProject] = useState(null);

  // ========================================
  // REFRESH PROJECT LIST
  // ========================================

  function handleProjectAdded() {
    setRefresh((prev) => prev + 1);
  }

  // ========================================
  // START EDITING
  // ========================================

  function handleEditProject(project) {
    setEditingProject(project);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ========================================
  // CANCEL EDIT
  // ========================================

  function handleCancelEdit() {
    setEditingProject(null);
  }

  // ========================================
  // UI
  // ========================================

  return (
    <Layout title="Manage Projects">
      <div className="max-w-6xl">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Portfolio Management
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Projects Management
          </h2>

          <p className="mt-3 text-gray-400">
            Add, edit and manage the projects displayed
            on your portfolio.
          </p>

        </div>


        {/* ========================================
            ADD / EDIT PROJECT FORM
        ======================================== */}

        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-8
            shadow-xl
          "
        >

          <ProjectsForm
            onProjectAdded={handleProjectAdded}
            editingProject={editingProject}
            onCancelEdit={handleCancelEdit}
          />

        </div>


        {/* ========================================
            EXISTING PROJECTS
        ======================================== */}

        <ProjectsList
          refresh={refresh}
          onEditProject={handleEditProject}
        />

      </div>
    </Layout>
  );
}