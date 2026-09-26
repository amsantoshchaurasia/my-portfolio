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
  // SHARED CLASSES (matches Certificates page)
  // ======================================================

  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  // ======================================================
  // UI
  // ======================================================

  return (
    <Layout title="Manage Resume">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Resume
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Upload, replace, view or remove your professional resume.
          </p>
        </div>

        {/* UPLOAD / REPLACE RESUME */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
          <form ref={formRef} onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className={labelClasses}>Resume PDF</label>

              <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-3.5">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2.5 text-[11px] text-gray-600">
                  PDF files only. Maximum file size: 10 MB.
                </p>

                {selectedFile && (
                  <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
                    <p className="text-[11px] text-gray-500">Selected file</p>
                    <p className="mt-0.5 break-all text-xs text-green-400">
                      {selectedFile.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-3.5 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold
                  text-white transition hover:bg-blue-500 disabled:cursor-not-allowed
                  disabled:opacity-60 sm:w-auto sm:px-6"
              >
                {uploading
                  ? "Uploading..."
                  : resumeURL
                  ? "Replace resume"
                  : "Upload resume"}
              </button>
            </div>
          </form>
        </div>

        {/* CURRENT RESUME STATUS */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white">
                Resume status
              </h3>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                Manage the resume currently stored in Firebase Storage.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-blue-500" />
              <p className="mt-2.5 text-xs text-gray-500">
                Checking current resume...
              </p>
            </div>
          ) : resumeURL ? (
            <div className="rounded-lg border border-slate-800 bg-[#111827] p-3.5 transition hover:border-slate-700">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      Current resume
                    </p>
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400">
                      Available
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Your latest resume is currently stored in Firebase Storage.
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <a
                    href={resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3 py-1.5
                      text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
                  >
                    View
                  </a>

                  <a
                    href={resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Santosh-Chaurasia-Resume.pdf"
                    className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5
                      text-xs font-semibold text-gray-300 transition hover:text-white"
                  >
                    Download
                  </a>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-1.5
                      text-xs font-semibold text-red-400 transition hover:bg-red-500/20
                      disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
                +
              </div>
              <h4 className="mt-3 text-sm font-semibold text-white">
                No resume uploaded
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Upload your latest PDF resume using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}