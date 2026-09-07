import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import {
  uploadResume,
  getResumeURL,
  deleteResume,
} from "../../firebase/storage";

// ======================================================
// RESUME MANAGEMENT
// ======================================================

export default function Resume() {
  const [resumeURL, setResumeURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formRef = useRef(null);

  // ======================================================
  // LOAD EXISTING RESUME
  // ======================================================

  async function loadResume() {
    try {
      setLoading(true);
      const url = await getResumeURL();
      setResumeURL(url);
    } catch (error) {
      console.error("Error loading resume:", error);
      alert("Failed to load resume.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResume();
  }, []);

  // ======================================================
  // FILE SELECT
  // ======================================================

  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Resume file must be smaller than 10 MB.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  // ======================================================
  // UPLOAD / REPLACE RESUME
  // ======================================================

  async function handleUpload(e) {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF resume first.");
      return;
    }

    const hadExistingResume = Boolean(resumeURL);
    let successMessage = "";

    try {
      setUploading(true);
      const result = await uploadResume(selectedFile);

      // Extract the correct URL string from the returned Cloudinary object
      const url = result.fileUrl || result.secureUrl || result.url;

      setResumeURL(url);
      setSelectedFile(null);

      if (formRef.current) {
        formRef.current.reset();
      }

      successMessage = hadExistingResume
        ? "Resume replaced successfully."
        : "Resume uploaded successfully.";
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(error.message || "Failed to upload resume.");
    } finally {
      setUploading(false); // Button will immediately return to normal state
    }

    // Show alert after uploading state is cleared
    if (successMessage) {
      alert(successMessage);
    }
  }

  // ======================================================
  // DELETE RESUME
  // ======================================================

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete the current resume?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteResume();
      setResumeURL(null);
      alert("Resume deleted successfully.");
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume.");
    } finally {
      setDeleting(false);
    }
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <Layout title="Manage Resume">
      <div className="max-w-6xl">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Portfolio Management
          </p>
          <h2 className="mt-3 text-4xl font-black text-white">
            Resume Management
          </h2>
          <p className="mt-3 text-gray-400">
            Upload, replace, view or remove your professional resume.
          </p>
        </div>

        {/* UPLOAD SECTION */}
        <div className="mb-10 rounded-3xl border border-slate-700 bg-[#111827] p-7 shadow-xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[4px] text-blue-400">
              Resume
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              {resumeURL ? "Replace Resume" : "Upload Resume"}
            </h3>
            <p className="mt-2 text-gray-400">
              Upload your latest resume in PDF format.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleUpload}>
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              Resume PDF
            </label>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700"
            />

            <p className="mt-2 text-sm text-gray-500">
              PDF only • Maximum file size: 10 MB
            </p>

            {selectedFile && (
              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm font-semibold text-blue-400">
                  Selected File
                </p>
                <p className="mt-1 break-all text-gray-300">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : resumeURL
                  ? "Replace Resume"
                  : "Upload Resume"}
              </button>
            </div>
          </form>
        </div>

        {/* CURRENT RESUME SECTION */}
        <div>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
              Current Resume
            </p>
            <h3 className="mt-2 text-3xl font-black text-white">
              Resume Status
            </h3>
            <p className="mt-2 text-gray-400">
              Manage the resume currently stored in Firebase Storage.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-[#111827] p-6">
              <p className="text-gray-400">Checking current resume...</p>
            </div>
          ) : resumeURL ? (
            <div className="rounded-2xl border border-slate-700 bg-[#111827] p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-bold text-white">
                      Current Resume
                    </h4>
                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                      Available
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Your latest resume is currently stored in Firebase Storage.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Resume
                  </a>

                  <a
                    href={resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Santosh-Chaurasia-Resume.pdf"
                    className="rounded-xl border border-blue-500/40 px-5 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
                  >
                    Download
                  </a>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-xl border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-[#111827] p-8 text-center">
              <div className="mx-auto max-w-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                  📄
                </div>
                <h4 className="mt-5 text-xl font-bold text-white">
                  No Resume Uploaded
                </h4>
                <p className="mt-2 text-gray-400">
                  Upload your latest PDF resume using the form above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}