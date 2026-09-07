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

  const [editingCertificate, setEditingCertificate] =
    useState(null);

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

      <div className="max-w-6xl">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Portfolio Management
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Certificates Management
          </h2>

          <p className="mt-3 text-gray-400">
            Add, edit or remove your professional
            certificates.
          </p>

        </div>

        {/* ========================================
            ADD / EDIT CERTIFICATE
        ======================================== */}

        <div
          className="
            mb-10
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-7
            shadow-xl
          "
        >

          <CertificatesForm
            onCertificateSaved={handleCertificateSaved}
            editingCertificate={editingCertificate}
            onCancelEdit={handleCancelEdit}
          />

        </div>

        {/* ========================================
            EXISTING CERTIFICATES
        ======================================== */}

        <CertificatesList
          refresh={refresh}
          onEditCertificate={handleEditCertificate}
        />

      </div>

    </Layout>
  );
}