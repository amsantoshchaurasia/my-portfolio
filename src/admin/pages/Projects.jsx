import { useState } from "react";

import Layout from "../components/Layout";
import ProjectsForm from "../components/ProjectsForm";
import ProjectsList from "../components/ProjectsList";

export default function Projects() {
  // ========================================
  // STATE
  // ========================================

  const [refresh, setRefresh] = useState(0);
  const [editingProject, setEditingProject] = useState(null);

  function handleProjectAdded() {
    setRefresh((prev) => prev + 1);
  }

  function handleEditProject(project) {
    setEditingProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingProject(null);
  }

  // ========================================
  // UI
  // ========================================

  return (
    <Layout title="Projects Management">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Projects
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Add, edit and manage the projects displayed on your portfolio.
          </p>
        </div>

        {/* ADD / EDIT PROJECT FORM */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
          <ProjectsForm
            onProjectAdded={handleProjectAdded}
            editingProject={editingProject}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* EXISTING PROJECTS */}
        <ProjectsList refresh={refresh} onEditProject={handleEditProject} />
      </div>
    </Layout>
  );
}