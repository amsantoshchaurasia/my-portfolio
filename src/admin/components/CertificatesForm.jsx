import { useEffect, useRef, useState } from "react";

import {
  createCertificate,
  updateCertificate,
} from "../../firebase/firestore";
import { getTechColor, KNOWN_SKILL_TAGS as TAG_SUGGESTIONS } from "../../utils/colors/techColors";
import { getPlatformColor, COMPANY_SUGGESTIONS } from "../../utils/colors/platformColors";
import {
  CERTIFICATE_TYPE_FILTER_OPTIONS as CERTIFICATE_TYPES,
  getCertificateTypeBadgeClasses as getCertificateCategoryBadgeClasses,
} from "../../utils/colors/typeColors";

// ======================================================
// INITIAL FORM
// ======================================================
// "technical" is the certificate-type default (was "web" before the
// Project type / Certificate type split — "web" is not a valid
// certificate type anymore).

const initialForm = {
  title: "",
  company: "",
  category: "technical",
  year: "",
  order: 1,
  tags: "",
};

// ======================================================
// TAGS
// ======================================================
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

// ======================================================
// CUSTOM DROPDOWN — styled to match the public-side filter
// dropdown (rounded pill button, dark panel, chevron that
// rotates). Each option renders as its real category badge
// color instead of a generic highlight.
// ======================================================

function SelectDropdown({ value, onChange, options, getBadgeClasses }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-lg border bg-slate-800/60 px-3 py-2.5
          text-sm outline-none transition
          ${open ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
      >
        {getBadgeClasses ? (
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeClasses(selected?.value)}`}
          >
            {selected?.label}
          </span>
        ) : (
          <span className="text-white">{selected?.label}</span>
        )}
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 flex-shrink-0 fill-none stroke-current stroke-[2.5] text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-slate-700
            bg-[#0F1729] p-1.5 shadow-lg shadow-black/40"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition
                    ${isSelected ? "bg-slate-800" : "hover:bg-slate-800/60"}`}
                >
                  {getBadgeClasses ? (
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeClasses(option.value)}`}
                    >
                      {option.label}
                    </span>
                  ) : (
                    <span className="text-gray-300">{option.label}</span>
                  )}

                  {isSelected && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-none stroke-current stroke-[2.5] text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// How many chips are visible before "Show more" / "+N more" is needed.
const COMPANY_PREVIEW_COUNT = 5;
const TAG_PREVIEW_COUNT = 5;

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

  // Preview pickers — collapsed to a short row by default,
  // "Show more" / "+N more" expands the full list.
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Free-typed custom tag, added via the box below the picker.
  const [customTag, setCustomTag] = useState("");

  // ======================================================
  // EDIT MODE
  // ======================================================

  useEffect(() => {
    if (editingCertificate) {
      setForm({
        title: editingCertificate.title || "",
        company: editingCertificate.company || "",
        category: editingCertificate.category || "technical",
        year: editingCertificate.year || "",
        order: editingCertificate.order || 1,
        tags: tagsToString(editingCertificate.tags),
      });

      setFile(null);
    } else {
      setForm(initialForm);
      setFile(null);
    }

    setCustomTag("");
    setShowAllCompanies(false);
    setShowAllTags(false);
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

  function handleCategoryChange(value) {
    setForm((prev) => ({ ...prev, category: value }));
  }

  // ======================================================
  // COMPANY QUICK-PICK — clicking a suggestion fills the field
  // (clicking the active one again clears it); typing a name
  // that isn't in the list keeps it as-is, still gets a
  // consistent color via getPlatformColor.
  // ======================================================

  function selectCompany(company) {
    setForm((prev) => ({
      ...prev,
      company: prev.company.trim().toLowerCase() === company.toLowerCase() ? "" : company,
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

  function removeTag(tag) {
    setForm((prev) => ({
      ...prev,
      tags: parseTags(prev.tags)
        .filter((item) => item !== tag)
        .join(", "),
    }));
  }

  // For a skill/platform not in the suggestions above. Still
  // gets a consistent color from getTechColor automatically.
  function handleAddCustomTag() {
    const value = customTag.trim();
    if (!value) return;

    const current = parseTags(form.tags);
    const alreadyAdded = current.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (!alreadyAdded) {
      setForm((prev) => ({
        ...prev,
        tags: [...current, value].join(", "),
      }));
    }

    setCustomTag("");
  }

  function handleCustomTagKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    }
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
        category: form.category || "other",
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
      setCustomTag("");

      // ==================================================
      // CLEAR FILE INPUTS
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
    setCustomTag("");

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

  const selectedTags = parseTags(form.tags);

  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 " +
    "text-sm text-white placeholder:text-gray-500 outline-none transition " +
    "focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/30 " +
    "disabled:cursor-not-allowed disabled:opacity-60";

  // Company picker derived state
  const visibleCompanies = showAllCompanies
    ? COMPANY_SUGGESTIONS
    : COMPANY_SUGGESTIONS.slice(0, COMPANY_PREVIEW_COUNT);
  const hiddenCompanyCount = COMPANY_SUGGESTIONS.length - COMPANY_PREVIEW_COUNT;
  const trimmedCompany = form.company.trim();

  // Tags picker derived state
  const visibleTags = showAllTags
    ? TAG_SUGGESTIONS
    : TAG_SUGGESTIONS.slice(0, TAG_PREVIEW_COUNT);
  const hiddenTagCount = TAG_SUGGESTIONS.length - TAG_PREVIEW_COUNT;

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

      {/* COMPANY / PLATFORM PICKER — each issuer uses the exact
          same color it has on the public portfolio. Preview of 5,
          "+N more" expands the full list. Typing a name not in the
          list still gets its own consistent color automatically. */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/20 p-2.5">
        <div className="flex flex-wrap gap-1.5">
          {visibleCompanies.map((company) => {
            const active = trimmedCompany.toLowerCase() === company.toLowerCase();
            const colorClasses = getPlatformColor(company);

            return (
              <button
                key={company}
                type="button"
                onClick={() => selectCompany(company)}
                disabled={loading}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  active
                    ? `bg-white/5 ${colorClasses}`
                    : "border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600 hover:text-gray-200"
                }`}
              >
                {company}
              </button>
            );
          })}

          {hiddenCompanyCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllCompanies((prev) => !prev)}
              disabled={loading}
              aria-expanded={showAllCompanies}
              className="shrink-0 rounded-full border border-dashed border-slate-600 bg-slate-800/40
                px-2.5 py-1 text-[11px] font-medium text-gray-400 transition hover:border-slate-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showAllCompanies ? "Show less" : `+ ${hiddenCompanyCount} more`}
            </button>
          )}

          {trimmedCompany && !visibleCompanies.some((c) => c.toLowerCase() === trimmedCompany.toLowerCase()) && (
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-full border bg-white/5 py-1 pl-2.5 pr-1.5 text-[11px] ${getPlatformColor(trimmedCompany)}`}
            >
              {trimmedCompany}
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, company: "" }))}
                disabled={loading}
                aria-label={`Clear ${trimmedCompany}`}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-70 transition hover:text-white hover:opacity-100 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </span>
          )}
        </div>
      </div>

      {/* CERTIFICATE TYPE — custom dropdown, each option colored
          exactly like its badge on the public portfolio. Uses its
          own independent list (Technical / Internship / Course /
          Professional / Soft Skills / Other) — separate from the
          Project type list. */}
      <div className="sm:max-w-xs">
        <label className={labelClasses}>Certificate type</label>
        <SelectDropdown
          value={form.category}
          onChange={handleCategoryChange}
          options={CERTIFICATE_TYPES}
          getBadgeClasses={getCertificateCategoryBadgeClasses}
        />
      </div>

      {/* TAGS / SKILLS */}
      <div>
        <label className={labelClasses}>Skills / Tags</label>

        {/* SELECTED CHIPS — each tag uses the exact same color it
            has on the public portfolio, known or custom-typed */}
        {selectedTags.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5 rounded-lg border border-slate-700 bg-slate-800/40 p-2.5">
            {selectedTags.map((tag) => {
              const colorClasses = getTechColor(tag);
              return (
                <span
                  key={tag}
                  className={`flex items-center gap-1.5 rounded-full border bg-white/5 py-1 pl-2.5 pr-1.5 text-[11px] ${colorClasses}`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={loading}
                    aria-label={`Remove ${tag}`}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-70 transition hover:text-white hover:opacity-100 disabled:cursor-not-allowed"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
                      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* PICKER — known skills, click to toggle. Preview of 5,
            "+N more" expands the full list. Selected chips light
            up in their real portfolio color. */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/20 p-2.5">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => {
              const active = selectedTags.some(
                (item) => item.toLowerCase() === tag.toLowerCase()
              );
              const colorClasses = getTechColor(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  disabled={loading}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    active
                      ? `bg-white/5 ${colorClasses}`
                      : "border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600 hover:text-gray-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}

            {hiddenTagCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTags((prev) => !prev)}
                disabled={loading}
                aria-expanded={showAllTags}
                className="shrink-0 rounded-full border border-dashed border-slate-600 bg-slate-800/40
                  px-2.5 py-1 text-[11px] font-medium text-gray-400 transition hover:border-slate-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {showAllTags ? "Show less" : `+ ${hiddenTagCount} more`}
              </button>
            )}
          </div>
        </div>

        {/* CUSTOM TAG — for a skill/platform not in the list above */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={handleCustomTagKeyDown}
            placeholder="Not in the list? Type here..."
            disabled={loading}
            className={inputClasses}
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            disabled={loading}
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-800/60 px-4 text-sm
              font-medium text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add
          </button>
        </div>

        <p className="mt-1.5 text-[11px] text-gray-600">
          These become the filter tabs on your portfolio. Anything you type that isn't in the
          list still gets its own consistent color automatically, same as on your portfolio.
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