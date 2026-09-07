import { useEffect, useState } from "react";
import {
  getHeroData,
  updateHeroData,
} from "../../firebase/firestore";
import { uploadPhotoFile } from "../../firebase/storage";

export default function HeroForm() {
  // ======================================================
  // INITIAL FORM
  // ======================================================

  const initialForm = {
    firstName: "",
    lastName: "",
    title: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    imageUrl: "",
  };

  // ======================================================
  // STATE
  // ======================================================

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ======================================================
  // LOAD HERO DATA
  // ======================================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const data = await getHeroData();

        if (data) {
          setForm({
            ...initialForm,
            ...data,
          });
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        }
      } catch (err) {
        console.error("Error loading hero data:", err);
        setError(
          "Unable to load Hero information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ======================================================
  // HANDLE IMAGE CHANGE
  // ======================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSuccess("");
      setError("");
    }
  };

  // ======================================================
  // SAVE HERO DATA
  // ======================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setSuccess("");
      setError("");

      let updatedImageUrl = form.imageUrl;

      // Agar user ne nayi image select ki hai toh pehle upload karein
      if (imageFile) {
        const uploadResult = await uploadPhotoFile(imageFile);
        updatedImageUrl = uploadResult.secureUrl;
      }

      const finalData = {
        ...form,
        imageUrl: updatedImageUrl,
      };

      await updateHeroData(finalData);
      setForm(finalData);
      setImageFile(null);

      setSuccess(
        "Hero section updated successfully."
      );
    } catch (err) {
      console.error("Error updating hero data:", err);
      setError(
        "Unable to update Hero section. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-400">
            Loading Hero information...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // INPUT CLASS
  // ======================================================

  const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-700
    bg-[#0B1120]
    px-4
    py-3
    text-white
    placeholder-slate-500
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/20
  `;

  // ======================================================
  // UI
  // ======================================================

  return (
    <form
      onSubmit={handleSave}
      className="space-y-8"
    >

      {/* ==================================================
          PROFILE PHOTO SECTION
      ================================================== */}

      <div>
        <h3 className="text-xl font-bold text-white">
          Hero Profile Photo
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Upload or update your profile picture displayed on the homepage.
        </p>
      </div>

      <div className="flex items-center gap-6">
        {imagePreview ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
            <img
              src={imagePreview}
              alt="Hero Preview"
              className="w-full h-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-gray-500 text-xs text-center">
            No Image
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-500
              cursor-pointer"
          />
          <p className="mt-2 text-xs text-slate-500">
            Recommended: Square image (PNG, JPG)
          </p>
        </div>
      </div>

      {/* ==================================================
          PERSONAL INFORMATION
      ================================================== */}

      <div className="pt-6 border-t border-slate-700">
        <h3 className="text-xl font-bold text-white">
          Personal Information
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Basic information displayed in your portfolio Hero section.
        </p>
      </div>

      {/* ==================================================
          NAME
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className={inputClass}
          />
        </div>

      </div>

      {/* ==================================================
          TITLE
      ================================================== */}

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Professional Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Data Analyst"
          className={inputClass}
        />
      </div>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write a short professional introduction..."
          rows={6}
          className={`${inputClass} resize-y`}
        />

        <p className="mt-2 text-xs text-slate-500">
          Keep the description professional and concise.
        </p>
      </div>

      {/* ==================================================
          CONTACT INFORMATION
      ================================================== */}

      <div className="pt-6 border-t border-slate-700">

        <h3 className="text-xl font-bold text-white">
          Contact Information
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Contact details displayed on your portfolio.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* EMAIL */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={inputClass}
          />
        </div>

        {/* PHONE */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={inputClass}
          />
        </div>

      </div>

      {/* LOCATION */}

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Maharashtra, India"
          className={inputClass}
        />
      </div>

      {/* ==================================================
          SOCIAL LINKS
      ================================================== */}

      <div className="pt-6 border-t border-slate-700">

        <h3 className="text-xl font-bold text-white">
          Social Profiles
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Add links to your professional social profiles.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* GITHUB */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            GitHub URL
          </label>

          <input
            type="url"
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className={inputClass}
          />
        </div>

        {/* LINKEDIN */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            LinkedIn URL
          </label>

          <input
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className={inputClass}
          />
        </div>

      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <p className="text-sm text-emerald-400">
            ✓ {success}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* ==================================================
          SAVE BUTTON
      ================================================== */}

      <div className="pt-6 border-t border-slate-700 flex justify-end">

        <button
          type="submit"
          disabled={saving}
          className="
            min-w-[170px]
            rounded-xl
            bg-blue-600
            px-6
            py-3
            text-white
            font-semibold
            transition-all
            hover:bg-blue-500
            hover:shadow-lg
            hover:shadow-blue-600/20
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </form>
  );
}