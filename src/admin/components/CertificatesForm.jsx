import { useEffect, useMemo, useRef, useState } from "react";

import {
  createCertificate,
  updateCertificate,
  getCertificates,
} from "../../firebase/firestore";
import {
  subscribeCertOptions,
  addCertOption,
  deleteCertOption,
  cleanLabel,
} from "../../firebase/certOptions";
import { getTechColor } from "../../utils/colors/techColors";
import { getPlatformColor } from "../../utils/colors/platformColors";
import {
  CERTIFICATE_TYPE_FILTER_OPTIONS as CERTIFICATE_TYPES,
  getCertificateTypeBadgeClasses as getCertificateCategoryBadgeClasses,
} from "../../utils/colors/typeColors";
import { MONTH_LABELS } from "../../utils/formatIssueDate";
import {
  DEFAULTS_BY_KIND,
  DEFAULT_DOMAINS,
  MAX_DOMAINS,
  MAX_TECH,
} from "../../utils/certificateOptions";

const MONTH_OPTIONS = [
  { value: "", label: "Month (optional)" },
  ...MONTH_LABELS.map((label, i) => ({ value: String(i + 1), label })),
];

// ======================================================
// INITIAL FORM
// company = Platform (kept as "company" so the public site keeps working)
// ======================================================

const initialForm = {
  title: "",
  company: "",
  category: "technical",
  domains: [],
  tech: [],
  year: "",
  month: "",
  featured: false,
  order: 1,
};

// Old certificates only have "tags". Split them into domain / tech.
function splitLegacyTags(tags) {
  const list = Array.isArray(tags)
    ? tags
    : String(tags || "").split(",").map((t) => t.trim()).filter(Boolean);

  const domainSet = new Set(DEFAULT_DOMAINS.map((d) => d.toLowerCase()));
  const domains = [];
  const tech = [];

  list.forEach((tag) => {
    if (domainSet.has(tag.toLowerCase())) domains.push(tag);
    else tech.push(tag);
  });

  return { domains, tech };
}

// ======================================================
// LIMITS + CLOUDINARY
// ======================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const CLOUD_NAME = "ftdks0h2";
const UPLOAD_PRESET = "portfolio_upload";

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to upload file to Cloudinary.");
  }

  return { fileUrl: data.secure_url, fileName: file.name };
}

// ======================================================
// CUSTOM DROPDOWN (used for Type and Month)
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
          <span className={selected?.value ? "text-white" : "text-gray-500"}>
            {selected?.label}
          </span>
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
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-700
            bg-[#0F1729] p-1.5 shadow-lg shadow-black/40"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value || "none"} role="option" aria-selected={isSelected}>
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

// ======================================================
// OPTION PICKER (chips + search + add new + delete custom)
// Used for Platform (single), Domain (max 2), Tech (max 5)
// ======================================================

const PREVIEW_COUNT = 8;

function OptionPicker({
  label,
  hint,
  placeholder,
  options, // [{ label, custom }]
  selected, // string[]
  max, // number
  single = false,
  disabled,
  getColor,
  onToggle,
  onAdd,
  onDelete,
  labelClasses,
  inputClasses,
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const trimmed = cleanLabel(query);
  const lowerQuery = trimmed.toLowerCase();

  const selectedLower = selected.map((s) => s.toLowerCase());
  const isSelected = (name) => selectedLower.includes(name.toLowerCase());

  const filtered = lowerQuery
    ? options.filter((o) => o.label.toLowerCase().includes(lowerQuery))
    : options;

  const visible = lowerQuery || showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);
  const hiddenCount = filtered.length - visible.length;

  const exactMatch = options.some((o) => o.label.toLowerCase() === lowerQuery);
  const canAdd = Boolean(trimmed) && !exactMatch;
  const atLimit = !single && selected.length >= max;

  function handleAdd() {
    if (!canAdd) return;
    onAdd(trimmed);
    setQuery("");
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (canAdd) {
      handleAdd();
    } else if (filtered.length === 1) {
      onToggle(filtered[0].label);
      setQuery("");
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className={`${labelClasses} !mb-0`}>{label}</label>
        <span
          className={`text-[11px] font-medium ${
            atLimit ? "text-amber-400" : "text-gray-500"
          }`}
        >
          {single ? (selected.length ? "1/1" : "0/1") : `${selected.length}/${max}`}
        </span>
      </div>

      {/* SELECTED */}
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5 rounded-lg border border-slate-700 bg-slate-800/40 p-2.5">
          {selected.map((item) => (
            <span
              key={item}
              className={`flex items-center gap-1.5 rounded-full border bg-white/5 py-1 pl-2.5 pr-1.5 text-[11px] ${getColor(item)}`}
            >
              {item}
              <button
                type="button"
                onClick={() => onToggle(item)}
                disabled={disabled}
                aria-label={`Remove ${item}`}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-70 transition hover:text-white hover:opacity-100 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* OPTIONS */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/20 p-2.5">
        <div className="flex flex-wrap gap-1.5">
          {visible.map((option) => {
            const active = isSelected(option.label);
            const blocked = !active && atLimit;

            return (
              <span
                key={option.label}
                className={`flex shrink-0 items-center rounded-full border text-[11px] font-medium transition ${
                  active
                    ? `bg-white/5 ${getColor(option.label)}`
                    : "border-slate-700 bg-slate-800/60 text-gray-400"
                } ${blocked ? "opacity-40" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onToggle(option.label)}
                  disabled={disabled || blocked}
                  aria-pressed={active}
                  className={`py-1 pl-2.5 ${option.custom ? "pr-1" : "pr-2.5"} disabled:cursor-not-allowed ${
                    active ? "" : "hover:text-gray-200"
                  }`}
                >
                  {option.label}
                </button>

                {option.custom && (
                  <button
                    type="button"
                    onClick={() => onDelete(option.label)}
                    disabled={disabled}
                    title="Delete this option"
                    aria-label={`Delete option ${option.label}`}
                    className="mr-1 flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-50 transition hover:text-red-400 hover:opacity-100 disabled:cursor-not-allowed"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
                      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                )}
              </span>
            );
          })}

          {!lowerQuery && (hiddenCount > 0 || showAll) && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              disabled={disabled}
              aria-expanded={showAll}
              className="shrink-0 rounded-full border border-dashed border-slate-600 bg-slate-800/40
                px-2.5 py-1 text-[11px] font-medium text-gray-400 transition hover:border-slate-500 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showAll ? "Show less" : `+ ${hiddenCount} more`}
            </button>
          )}

          {lowerQuery && filtered.length === 0 && !canAdd && (
            <span className="text-[11px] text-gray-500">No match.</span>
          )}
        </div>
      </div>

      {/* SEARCH / ADD */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled}
            className="max-w-[45%] shrink-0 truncate rounded-lg border border-blue-500/40 bg-blue-500/10 px-3.5 text-sm
              font-medium text-blue-400 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Add "{trimmed}"
          </button>
        )}
      </div>

      {hint && <p className="mt-1.5 text-[11px] text-gray-600">{hint}</p>}
    </div>
  );
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

  // custom options saved in Firestore
  const [customOptions, setCustomOptions] = useState({
    platform: [],
    domain: [],
    tech: [],
  });

  // ======================================================
  // LOAD CUSTOM OPTIONS (live)
  // ======================================================

  useEffect(() => {
    const unsubscribe = subscribeCertOptions(setCustomOptions, () =>
      setError(
        "Could not load saved options. Check the Firestore rules for the 'certOptions' collection."
      )
    );
    return unsubscribe;
  }, []);

  // defaults + custom, no duplicates (case-insensitive)
  const optionsByKind = useMemo(() => {
    const result = {};

    ["platform", "domain", "tech"].forEach((kind) => {
      const defaults = DEFAULTS_BY_KIND[kind];
      const seen = new Set(defaults.map((d) => d.toLowerCase()));

      const list = defaults.map((label) => ({ label, custom: false }));

      customOptions[kind].forEach((label) => {
        if (!seen.has(label.toLowerCase())) {
          seen.add(label.toLowerCase());
          list.push({ label, custom: true });
        }
      });

      result[kind] = list;
    });

    return result;
  }, [customOptions]);

  // ======================================================
  // EDIT MODE
  // ======================================================

  useEffect(() => {
    if (editingCertificate) {
      const hasNewFields =
        Array.isArray(editingCertificate.domains) ||
        Array.isArray(editingCertificate.tech);

      const { domains, tech } = hasNewFields
        ? {
            domains: editingCertificate.domains || [],
            tech: editingCertificate.tech || [],
          }
        : splitLegacyTags(editingCertificate.tags);

      setForm({
        title: editingCertificate.title || "",
        company: editingCertificate.company || "",
        category: editingCertificate.category || "technical",
        domains,
        tech,
        year: editingCertificate.year || "",
        month: editingCertificate.month ? String(editingCertificate.month) : "",
        featured: Boolean(editingCertificate.featured),
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
  // SIMPLE CHANGES
  // ======================================================

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCategoryChange(value) {
    setForm((prev) => ({ ...prev, category: value }));
  }

  function handleMonthChange(value) {
    setForm((prev) => ({ ...prev, month: value }));
  }

  function toggleFeatured() {
    setForm((prev) => ({ ...prev, featured: !prev.featured }));
  }

  // ======================================================
  // OPTION PICKERS
  // ======================================================

  function togglePlatform(label) {
    setForm((prev) => ({
      ...prev,
      company: prev.company.toLowerCase() === label.toLowerCase() ? "" : label,
    }));
  }

  function toggleInList(field, max) {
    return (label) => {
      setForm((prev) => {
        const current = prev[field];
        const exists = current.some((item) => item.toLowerCase() === label.toLowerCase());

        if (exists) {
          return {
            ...prev,
            [field]: current.filter((item) => item.toLowerCase() !== label.toLowerCase()),
          };
        }

        if (current.length >= max) return prev;
        return { ...prev, [field]: [...current, label] };
      });
    };
  }

  const toggleDomain = toggleInList("domains", MAX_DOMAINS);
  const toggleTech = toggleInList("tech", MAX_TECH);

  // Add a new option: reuse it if it already exists (any spelling case),
  // otherwise save it to Firestore. Then select it.
  async function handleAddOption(kind, label, select) {
    const existing = optionsByKind[kind].find(
      (o) => o.label.toLowerCase() === label.toLowerCase()
    );

    if (existing) {
      select(existing.label);
      return;
    }

    select(label);

    try {
      await addCertOption(kind, label);
    } catch (err) {
      console.error("Add option failed:", err);
      setError(
        "The option is selected, but it could not be saved for next time. Check the Firestore rules for 'certOptions'."
      );
    }
  }

  // Delete a custom option, but only if no certificate uses it.
  async function handleDeleteOption(kind, label) {
    setError("");
    setMessage("");

    try {
      const all = await getCertificates();
      const lower = label.toLowerCase();

      const used = all.some((c) => {
        if (kind === "platform") return String(c.company || "").toLowerCase() === lower;

        const field = kind === "domain" ? c.domains : c.tech;
        const inField = (field || []).some((x) => String(x).toLowerCase() === lower);
        const inLegacyTags = (Array.isArray(c.tags) ? c.tags : []).some(
          (x) => String(x).toLowerCase() === lower
        );

        return inField || inLegacyTags;
      });

      if (used) {
        setError(`"${label}" is used in a certificate, so it can't be deleted.`);
        return;
      }

      if (!window.confirm(`Delete the option "${label}"?`)) return;

      await deleteCertOption(kind, label);
    } catch (err) {
      console.error("Delete option failed:", err);
      setError("Could not delete the option. Please try again.");
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

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF certificate files are allowed.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Certificate PDF must be smaller than 10 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  // ======================================================
  // FORM VALIDATION
  // ======================================================

  function validateForm() {
    if (!form.title.trim()) return "Certificate title is required.";
    if (!form.company.trim()) return "Platform is required.";
    if (form.domains.length === 0) return "Pick at least one domain.";
    if (!form.year.trim()) return "Year is required.";
    if (!/^\d{4}$/.test(form.year.trim())) return "Please enter a valid 4-digit year.";
    if (!editingCertificate && !file) return "Please upload the certificate PDF.";
    if (Number(form.order) < 1) return "Display order must be at least 1.";

    if (form.featured && form.category === "other") {
      return "A featured certificate can't be type 'Other'. Pick a specific type.";
    }

    return "";
  }

  // ======================================================
  // SUBMIT
  // ======================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const certificateData = {
        title: form.title.trim(),
        company: form.company.trim(), // Platform
        category: form.category || "other", // Type
        domains: form.domains,
        tech: form.tech,
        // "tags" is kept (domains + tech) so the public site and AI chatbot keep working
        tags: [...form.domains, ...form.tech],
        year: form.year.trim(),
        month: form.month ? Number(form.month) : null,
        featured: form.featured,
        order: Number(form.order) || 1,
      };

      if (file) {
        const uploadedFile = await uploadToCloudinary(file);
        certificateData.fileUrl = uploadedFile.fileUrl;
        certificateData.fileName = uploadedFile.fileName;
      }

      if (!editingCertificate) {
        await createCertificate(certificateData);
        setMessage("Certificate uploaded successfully.");
      } else {
        await updateCertificate(editingCertificate.id, certificateData);
        setMessage("Certificate updated successfully.");
      }

      setForm(initialForm);
      setFile(null);

      const fileInput = document.getElementById("certificate-pdf");
      if (fileInput) fileInput.value = "";

      onCertificateSaved?.();

      if (editingCertificate) onCancelEdit?.();
    } catch (err) {
      console.error("Certificate save error:", err);
      setError(err?.message || "Failed to save certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  function handleCancel() {
    if (loading) return;

    setForm(initialForm);
    setFile(null);
    setMessage("");
    setError("");

    const fileInput = document.getElementById("certificate-pdf");
    if (fileInput) fileInput.value = "";

    onCancelEdit?.();
  }

  // ======================================================
  // DERIVED STATE
  // ======================================================

  const isEditing = Boolean(editingCertificate);

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

      {message && (
        <div className="rounded-lg border border-green-500/25 bg-green-500/10 px-3.5 py-2.5 text-xs text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* TITLE */}
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

      {/* PLATFORM */}
      <OptionPicker
        label="Platform"
        placeholder="Search or add a platform..."
        options={optionsByKind.platform}
        selected={form.company ? [form.company] : []}
        max={1}
        single
        disabled={loading}
        getColor={getPlatformColor}
        onToggle={togglePlatform}
        onAdd={(label) => handleAddOption("platform", label, (v) => setForm((p) => ({ ...p, company: v })))}
        onDelete={(label) => handleDeleteOption("platform", label)}
        labelClasses={labelClasses}
        inputClasses={inputClasses}
      />

      {/* TYPE */}
      <div className="sm:max-w-xs">
        <label className={labelClasses}>Certificate type</label>
        <SelectDropdown
          value={form.category}
          onChange={handleCategoryChange}
          options={CERTIFICATE_TYPES}
          getBadgeClasses={getCertificateCategoryBadgeClasses}
        />
      </div>

      {/* DOMAIN */}
      <OptionPicker
        label="Domain"
        placeholder="Search or add a domain..."
        hint="The topic of the certificate. This becomes the main filter on your portfolio."
        options={optionsByKind.domain}
        selected={form.domains}
        max={MAX_DOMAINS}
        disabled={loading}
        getColor={getTechColor}
        onToggle={toggleDomain}
        onAdd={(label) => handleAddOption("domain", label, toggleDomain)}
        onDelete={(label) => handleDeleteOption("domain", label)}
        labelClasses={labelClasses}
        inputClasses={inputClasses}
      />

      {/* TECH / TOOLS */}
      <OptionPicker
        label="Tech / Tools"
        placeholder="Search or add a tool..."
        hint="Languages, tools and libraries used, like Python, SQL or Power BI."
        options={optionsByKind.tech}
        selected={form.tech}
        max={MAX_TECH}
        disabled={loading}
        getColor={getTechColor}
        onToggle={toggleTech}
        onAdd={(label) => handleAddOption("tech", label, toggleTech)}
        onDelete={(label) => handleDeleteOption("tech", label)}
        labelClasses={labelClasses}
        inputClasses={inputClasses}
      />

      {/* MONTH / YEAR / ORDER */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClasses}>Month</label>
          <SelectDropdown
            value={form.month}
            onChange={handleMonthChange}
            options={MONTH_OPTIONS}
          />
        </div>

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

      {/* FEATURED TOGGLE */}
      <button
        type="button"
        onClick={toggleFeatured}
        disabled={loading}
        aria-pressed={form.featured}
        className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition
          disabled:cursor-not-allowed disabled:opacity-60 ${
            form.featured
              ? "border-amber-400/40 bg-amber-400/10"
              : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
          }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 shrink-0 stroke-current stroke-2 ${
            form.featured ? "fill-current text-amber-400" : "fill-none text-gray-500"
          }`}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>
          <span className="block text-sm font-medium text-white">Featured certificate</span>
          <span className="block text-[11px] text-gray-500">
            Only featured certificates show by default on your portfolio (6 is ideal).
          </span>
        </span>
      </button>

      {/* PDF UPLOAD */}
      <div>
        <label htmlFor="certificate-pdf" className={labelClasses}>
          Certificate PDF
        </label>

        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-3.5">
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