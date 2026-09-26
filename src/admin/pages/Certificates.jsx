import { useState } from "react";

import Layout from "../components/Layout";
import CertificatesForm from "../components/CertificatesForm";
import CertificatesList from "../components/CertificatesList";

export default function Certificates() {
  // ========================================
  // REFRESH STATE
  // ========================================

  const [refresh, setRefresh] = useState(0);

  // ========================================
  // EDITING CERTIFICATE
  // ========================================

  const [editingCertificate, setEditingCertificate] = useState(null);

  // ========================================
  // AFTER SAVE
  // ========================================

  function handleCertificateSaved() {
    setRefresh((prev) => prev + 1);
  }

  // ========================================
  // EDIT CERTIFICATE
  // ========================================

  function handleEditCertificate(certificate) {
    setEditingCertificate(certificate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ========================================
  // CANCEL EDIT
  // ========================================

  function handleCancelEdit() {
    setEditingCertificate(null);
  }

  // ========================================
  // UI
  // ========================================

  return (
    <Layout title="Manage Certificates">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Certificates
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Add, edit or remove your professional certificates.
          </p>
        </div>

        {/* ADD / EDIT CERTIFICATE */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
          <CertificatesForm
            onCertificateSaved={handleCertificateSaved}
            editingCertificate={editingCertificate}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* EXISTING CERTIFICATES */}
        <div className="mt-6 sm:mt-8">
          <CertificatesList
            refresh={refresh}
            onEditCertificate={handleEditCertificate}
          />
        </div>
      </div>
    </Layout>
  );
}