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
  order: 1,
  tags: "",
};

// ======================================================
// TAGS
// ======================================================
// Quick-pick suggestions keep spelling consistent so the
// portfolio filter tabs don't get duplicates like "sql" / "SQL".
const TAG_SUGGESTIONS = [
  "Data Analytics",
  "Python",
  "SQL",
  "Power BI",
  "Excel",
  "Web Development",
  "Other",
];

// "Power BI, SQL" -> ["Power BI", "SQL"]  (trimmed, no duplicates)
function parseTags(value) {
  const seen = new Set();

  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

// Firestore value (array or string) -> "Power BI, SQL"
function tagsToString(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

// ======================================================
// LIMITS
// ======================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB  (thumbnail image - disabled for now)

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

// // ======================================================
// // CLOUDINARY IMAGE UPLOAD (for certificate thumbnail)
// // DISABLED: portfolio cards no longer show an image.
// // Uncomment this (and the other "THUMBNAIL" comments) to bring it back.
// // ======================================================
//
// async function uploadImageToCloudinary(file) {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", UPLOAD_PRESET);
//
//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );
//
//   const data = await response.json();
//
//   if (!response.ok) {
//     throw new Error(data.error?.message || "Failed to upload image to Cloudinary.");
//   }
//
//   return {
//     imageUrl: data.secure_url,
//   };
// }

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

  // THUMBNAIL (disabled)
  // const [imageFile, setImageFile] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);

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
        order: editingCertificate.order || 1,
        tags: tagsToString(editingCertificate.tags),
      });

      setFile(null);
      // THUMBNAIL (disabled)
      // setImageFile(null);
      // setImagePreview(null);
    } else {
      setForm(initialForm);
      setFile(null);
      // THUMBNAIL (disabled)
      // setImageFile(null);
      // setImagePreview(null);
    }

    setMessage("");
    setError("");
  }, [editingCertificate]);

  // ======================================================
  // CLEANUP IMAGE PREVIEW OBJECT URL (THUMBNAIL - disabled)
  // ======================================================
  //
  // useEffect(() => {
  //   return () => {
  //     if (imagePreview) {
  //       URL.revokeObjectURL(imagePreview);
  //     }
  //   };
  // }, [imagePreview]);

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
  // TAG QUICK-PICK (toggle a suggestion on / off)
  // ======================================================

  function toggleTag(tag) {
    setForm((prev) => {
      const current = parseTags(prev.tags);
      const exists = current.some(
        (item) => item.toLowerCase() === tag.toLowerCase()
      );

      const next = exists
        ? current.filter((item) => item.toLowerCase() !== tag.toLowerCase())
        : [...current, tag];

      return { ...prev, tags: next.join(", ") };
    });
  }

  // ======================================================
  // FILE VALIDATION (PDF)
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
      setError("Certificate PDF must be smaller than 10 MB.");

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
  // IMAGE VALIDATION (THUMBNAIL - disabled)
  // ======================================================
  //
  // function handleImageChange(event) { ... }

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
        order: Number(form.order) || 1,
        tags: parseTags(form.tags),
      };

      // ==================================================
      // UPLOAD NEW PDF TO CLOUDINARY IF SELECTED
      // ==================================================

      if (file) {
        const uploadedFile = await uploadToCloudinary(file);
        certificateData.fileUrl = uploadedFile.fileUrl;
        certificateData.fileName = uploadedFile.fileName;
      }

      // UPLOAD NEW IMAGE TO CLOUDINARY IF SELECTED (THUMBNAIL - disabled)

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
        await updateCertificate(editingCertificate.id, certificateData);
        setMessage("Certificate updated successfully.");
      }

      // ==================================================
      // RESET FORM
      // ==================================================

      setForm(initialForm);
      setFile(null);
      // THUMBNAIL (disabled)

      // ==================================================
      // CLEAR FILE INPUTS
      // ==================================================

      const fileInput = document.getElementById("certificate-pdf");
      if (fileInput) {
        fileInput.value = "";
      }
      // THUMBNAIL (disabled)

      // ==================================================
      // REFRESH ADMIN LIST & EXIT EDIT
      // ==================================================

      onCertificateSaved?.();

      if (editingCertificate) {
        onCancelEdit?.();
      }
    } catch (error) {
      console.error("Certificate save error:", error);
      setError(error?.message || "Failed to save certificate. Please try again.");
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
    // THUMBNAIL (disabled)

    setMessage("");
    setError("");

    const fileInput = document.getElementById("certificate-pdf");
    if (fileInput) {
      fileInput.value = "";
    }
    // THUMBNAIL (disabled)

    onCancelEdit?.();
  }

  // ======================================================
  // EDIT STATE
  // ======================================================

  const isEditing = Boolean(editingCertificate);

  const selectedTags = parseTags(form.tags);

  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 " +
    "text-sm text-white placeholder:text-gray-500 outline-none transition " +
    "focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/30 " +
    "disabled:cursor-not-allowed disabled:opacity-60";

  // ======================================================
  // UI
  // ======================================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white">
          {isEditing ? "Edit certificate" : "Add new certificate"}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Upload your certificate PDF via Cloudinary.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="rounded-lg border border-green-500/25 bg-green-500/10 px-3.5 py-2.5 text-xs text-green-400">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* TITLE + COMPANY */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Certificate title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="BCG Data Science Job Simulation"
            disabled={loading}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Company / Issuer</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Forage"
            disabled={loading}
            className={inputClasses}
          />
        </div>
      </div>

      {/* TAGS / SKILLS */}
      <div>
        <label className={labelClasses}>Skills / Tags</label>

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="e.g. Power BI, SQL"
          disabled={loading}
          className={inputClasses}
        />

        {/* QUICK PICK */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {TAG_SUGGESTIONS.map((tag) => {
            const active = selectedTags.some(
              (item) => item.toLowerCase() === tag.toLowerCase()
            );

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={loading}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  active
                    ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                    : "border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600 hover:text-white"
                }`}
              >
                {active ? "✓ " : "+ "}
                {tag}
              </button>
            );
          })}
        </div>

        <p className="mt-1.5 text-[11px] text-gray-600">
          Separate multiple tags with commas. These become the filter tabs on
          your portfolio, so keep spelling consistent.
        </p>
      </div>

      {/* YEAR / ORDER */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Year</label>
          <input
            type="text"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2026"
            maxLength={4}
            disabled={loading}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Display order</label>
          <input
            type="number"
            name="order"
            min="1"
            value={form.order}
            onChange={handleChange}
            disabled={loading}
            className={inputClasses}
          />
        </div>
      </div>

      {/* PDF UPLOAD */}
      <div>
        <label htmlFor="certificate-pdf" className={labelClasses}>
          Certificate PDF
        </label>

        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-3.5">
          {/* CURRENT FILE */}
          {isEditing && editingCertificate.fileName && (
            <div className="mb-3 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Current certificate
              </p>
              <p className="mt-0.5 break-all text-xs text-blue-400">
                {editingCertificate.fileName}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Select a new PDF only if you want to replace this file.
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
            className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2.5 text-[11px] text-gray-600">
            PDF files only. Maximum file size: 10 MB.
          </p>

          {isEditing && (
            <p className="mt-1 text-[11px] text-gray-600">
              Leave empty to keep the existing PDF.
            </p>
          )}

          {/* SELECTED FILE */}
          {file && (
            <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
              <p className="text-[11px] text-gray-500">Selected file</p>
              <p className="mt-0.5 break-all text-xs text-green-400">{file.name}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-3.5 sm:flex-row-reverse">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold
            text-white transition hover:bg-blue-500 disabled:cursor-not-allowed
            disabled:opacity-60 sm:w-auto sm:px-6"
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Uploading..."
            : isEditing
              ? "Save changes"
              : "Upload certificate"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5
              text-sm font-semibold text-gray-300 transition hover:text-white
              disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}