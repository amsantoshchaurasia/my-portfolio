import { useEffect, useState } from "react";

import {
  createCertificate,
  updateCertificate,
} from "../../firebase/firestore";

// ======================================================
// INITIAL FORM
// ======================================================

const initialForm = {
  title: "",
  company: "",
  year: "",
  type: "major",
  description: "",
  order: 1,
};

// ======================================================
// LIMITS
// ======================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ======================================================
// CLOUDINARY CONFIG
// ======================================================
// Replace with your actual Cloudinary Cloud Name if different
const CLOUD_NAME = "ftdks0h2"; 
const UPLOAD_PRESET = "portfolio_upload";

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to upload file to Cloudinary.");
  }

  return {
    fileUrl: data.secure_url,
    fileName: file.name,
  };
}

// ======================================================
// COMPONENT
// ======================================================

export default function CertificatesForm({
  onCertificateSaved,
  editingCertificate,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialForm);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // ======================================================
  // EDIT MODE
  // ======================================================

  useEffect(() => {
    if (editingCertificate) {
      setForm({
        title: editingCertificate.title || "",
        company: editingCertificate.company || "",
        year: editingCertificate.year || "",
        type: editingCertificate.type || "major",
        description: editingCertificate.description || "",
        order: editingCertificate.order || 1,
      });

      setFile(null);
    } else {
      setForm(initialForm);
      setFile(null);
    }

    setMessage("");
    setError("");
  }, [editingCertificate]);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ======================================================
  // FILE VALIDATION
  // ======================================================

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // ----------------------------------------------------
    // PDF CHECK
    // ----------------------------------------------------

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF certificate files are allowed.");

      event.target.value = "";
      setFile(null);

      return;
    }

    // ----------------------------------------------------
    // FILE SIZE CHECK
    // ----------------------------------------------------

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        "Certificate PDF must be smaller than 10 MB."
      );

      event.target.value = "";
      setFile(null);

      return;
    }

    // ----------------------------------------------------
    // VALID FILE
    // ----------------------------------------------------

    setFile(selectedFile);
  }

  // ======================================================
  // FORM VALIDATION
  // ======================================================

  function validateForm() {
    if (!form.title.trim()) {
      return "Certificate title is required.";
    }

    if (!form.company.trim()) {
      return "Company / issuer is required.";
    }

    if (!form.year.trim()) {
      return "Year is required.";
    }

    if (!/^\d{4}$/.test(form.year.trim())) {
      return "Please enter a valid 4-digit year.";
    }

    if (!editingCertificate && !file) {
      return "Please upload the certificate PDF.";
    }

    if (Number(form.order) < 1) {
      return "Display order must be at least 1.";
    }

    return "";
  }

  // ======================================================
  // SUBMIT
  // ======================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setMessage("");
    setError("");

    // ----------------------------------------------------
    // VALIDATE
    // ----------------------------------------------------

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // COMMON CERTIFICATE DATA
      // ==================================================

      let certificateData = {
        title: form.title.trim(),
        company: form.company.trim(),
        year: form.year.trim(),
        type: form.type,
        description: form.description.trim(),
        order: Number(form.order) || 1,
      };

      // ==================================================
      // UPLOAD NEW PDF TO CLOUDINARY IF SELECTED
      // ==================================================

      if (file) {
        const uploadedFile = await uploadToCloudinary(file);
        certificateData.fileUrl = uploadedFile.fileUrl;
        certificateData.fileName = uploadedFile.fileName;
      }

      // ==================================================
      // CREATE NEW CERTIFICATE
      // ==================================================

      if (!editingCertificate) {
        await createCertificate(certificateData);
        setMessage("Certificate uploaded successfully.");
      }

      // ==================================================
      // EDIT EXISTING CERTIFICATE
      // ==================================================

      else {
        await updateCertificate(
          editingCertificate.id,
          certificateData
        );
        setMessage("Certificate updated successfully.");
      }

      // ==================================================
      // RESET FORM
      // ==================================================

      setForm(initialForm);
      setFile(null);

      // ==================================================
      // CLEAR FILE INPUT
      // ==================================================

      const fileInput = document.getElementById("certificate-pdf");
      if (fileInput) {
        fileInput.value = "";
      }

      // ==================================================
      // REFRESH ADMIN LIST & EXIT EDIT
      // ==================================================

      onCertificateSaved?.();

      if (editingCertificate) {
        onCancelEdit?.();
      }
    } catch (error) {
      console.error("Certificate save error:", error);
      setError(
        error?.message ||
          "Failed to save certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  function handleCancel() {
    if (loading) {
      return;
    }

    setForm(initialForm);
    setFile(null);
    setMessage("");
    setError("");

    const fileInput = document.getElementById("certificate-pdf");
    if (fileInput) {
      fileInput.value = "";
    }

    onCancelEdit?.();
  }

  // ======================================================
  // EDIT STATE
  // ======================================================

  const isEditing = Boolean(editingCertificate);

  // ======================================================
  // UI
  // ======================================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[4px] text-blue-400">
          {isEditing ? "Edit Certificate" : "Add Certificate"}
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          {isEditing ? "Update Certificate" : "Upload New Certificate"}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Upload your certificate PDF directly via Cloudinary.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* TITLE */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Certificate Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="BCG Data Science Job Simulation"
          disabled={loading}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* COMPANY / ISSUER */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Company / Issuer
        </label>

        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Forage"
          disabled={loading}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* YEAR / TYPE / ORDER */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* YEAR */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Year
          </label>

          <input
            type="text"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2026"
            maxLength={4}
            disabled={loading}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Type
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="major">Featured</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* ORDER */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Display Order
          </label>

          <input
            type="number"
            name="order"
            min="1"
            value={form.order}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe what was completed..."
          disabled={loading}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* PDF UPLOAD */}
      <div>
        <label
          htmlFor="certificate-pdf"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Certificate PDF
        </label>

        <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-950/60 p-5">
          {/* CURRENT FILE */}
          {isEditing && editingCertificate.fileName && (
            <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Current Certificate
              </p>
              <p className="mt-1 break-all text-sm text-blue-400">
                {editingCertificate.fileName}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Select a new PDF only if you want to replace this certificate file.
              </p>
            </div>
          )}

          {/* FILE INPUT */}
          <input
            id="certificate-pdf"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-3 text-xs text-gray-500">
            PDF files only. Maximum file size: 10 MB.
          </p>

          {isEditing && (
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to keep the existing PDF.
            </p>
          )}

          {/* SELECTED FILE */}
          {file && (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
              <p className="text-xs text-gray-500">Selected file</p>
              <p className="mt-1 break-all text-sm text-green-400">{file.name}</p>
              <p className="mt-1 text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Uploading..."
            : isEditing
            ? "Update Certificate"
            : "Upload Certificate"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-gray-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}