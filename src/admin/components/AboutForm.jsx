import { useEffect, useState } from "react";
import {
  getAboutData,
  updateAboutData,
} from "../../firebase/firestore";
import { HiCamera, HiPencil } from "react-icons/hi";

export default function AboutForm() {
  const initialForm = {
    heading: "",
    description: "",
    role: "",
    experience: "",
    location: "",
    shortBio: "",
    imageUrl: "",
  };

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState(initialForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Guards against the "ghost click" issue on touch devices: tapping
  // "Edit About" swaps that exact spot for the "Save Changes" submit
  // button, and a delayed synthetic click can land on the new button
  // and submit the form instantly. This blocks submits for a brief
  // window right after entering edit mode.
  const [justEnteredEdit, setJustEnteredEdit] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAboutData();

        if (data) {
          const loadedForm = {
            heading: data.heading || "",
            description: data.description || "",
            role: data.role || "",
            experience: data.experience || "",
            location: data.location || "",
            shortBio: data.shortBio || "",
            imageUrl: data.imageUrl || "",
          };

          setForm(loadedForm);
          setOriginalForm(loadedForm);

          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error loading About data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ======================================================
  // ENTER EDIT MODE
  // ======================================================

  const handleEditClick = () => {
    setIsEditing(true);

    // Swallow any ghost/delayed click that lands on the Save button
    // right after it appears in this same spot.
    setJustEnteredEdit(true);
    setTimeout(() => setJustEnteredEdit(false), 400);
  };

  // ======================================================
  // CANCEL EDIT — revert any unsaved changes
  // ======================================================

  const handleCancelEdit = () => {
    if (saving) return;

    setForm(originalForm);
    setImageFile(null);
    setImagePreview(originalForm.imageUrl || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (saving || justEnteredEdit) return;

    try {
      setSaving(true);
      let updatedImageUrl = form.imageUrl;

      // Upload new image to Cloudinary if selected
      if (imageFile) {
        const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "portfolio/about");

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        const uploadData = await response.json();

        if (!response.ok) {
          throw new Error(uploadData?.error?.message || "About image upload failed.");
        }

        updatedImageUrl = uploadData.secure_url;
      }

      const finalData = {
        ...form,
        imageUrl: updatedImageUrl,
      };

      await updateAboutData(finalData);

      setForm(finalData);
      setOriginalForm(finalData);
      setImageFile(null);
      setIsEditing(false);

      alert("About section updated successfully.");
    } catch (error) {
      console.error("Error updating About data:", error);
      alert("Failed to update About section.");
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
            Loading About data...
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
    px-3
    py-2.5
    text-sm
    text-white
    placeholder-slate-500
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/20
    disabled:cursor-not-allowed
    disabled:opacity-60
    disabled:bg-slate-900/40
    sm:px-4
    sm:py-3
    sm:text-base
    md:py-3.5
    lg:px-5
    xl:py-4
    xl:text-lg
    2xl:px-6
    2xl:py-4
  `;

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 xl:space-y-9 2xl:space-y-10">

      {/* ==================================================
          PROFILE PHOTO — avatar + camera badge (matches Hero
          Section's upload style)
      ================================================== */}

      <div className="text-center lg:text-left">
        <div className="flex flex-col items-center gap-2 sm:gap-3 lg:flex-row lg:items-center lg:gap-6 xl:gap-8 2xl:gap-10">

          <div className="relative w-20 h-20 shrink-0 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-24 lg:h-24 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36">

            {imagePreview ? (
              <div className="h-full w-full overflow-hidden rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
                <img
                  src={imagePreview}
                  alt="About Preview"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-center text-[10px] text-gray-500 sm:text-xs">
                No Image
              </div>
            )}

            <label
              htmlFor="aboutImageInput"
              className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#111827] bg-blue-600 text-white shadow-md transition-all hover:bg-blue-500 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-8 lg:w-8 xl:h-10 xl:w-10 2xl:h-11 2xl:w-11"
            >
              <HiCamera className="text-sm sm:text-base xl:text-lg 2xl:text-xl" />
            </label>

            <input
              id="aboutImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <p className="text-xs font-semibold text-white sm:text-sm md:text-base xl:text-lg 2xl:text-xl">
            Profile Photo
          </p>

        </div>
      </div>

      {/* ==================================================
          HEADING
      ================================================== */}

      <div>
        <label className="block mb-1 text-xs font-medium text-gray-300 sm:mb-1.5 sm:text-sm xl:text-base 2xl:text-lg">
          Heading
        </label>

        <input
          type="text"
          name="heading"
          value={form.heading}
          onChange={handleChange}
          placeholder="About Me"
          disabled={!isEditing}
          className={inputClass}
        />
      </div>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <div>
        <label className="block mb-1 text-xs font-medium text-gray-300 sm:mb-1.5 sm:text-sm xl:text-base 2xl:text-lg">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Write your About description..."
          disabled={!isEditing}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* ==================================================
          ROLE + EXPERIENCE
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-300 sm:mb-1.5 sm:text-sm xl:text-base 2xl:text-lg">
            Role
          </label>

          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Data Analyst"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-300 sm:mb-1.5 sm:text-sm xl:text-base 2xl:text-lg">
            Experience
          </label>

          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Data Analytics & IT Experience"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

      </div>

      {/* ==================================================
          LOCATION
      ================================================== */}

      <div>
        <label className="block mb-1 text-xs font-medium text-gray-300 sm:mb-1.5 sm:text-sm xl:text-base 2xl:text-lg">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Mumbai, Maharashtra"
          disabled={!isEditing}
          className={inputClass}
        />
      </div>

      {/* ==================================================
          SHORT BIO
      ================================================== */}

      <div>
        <label className="block mb-1 text-xs font-medium text-gray-300 sm:mb-1.5 sm:text-sm xl:text-base 2xl:text-lg">
          Short Bio
        </label>

        <textarea
          name="shortBio"
          value={form.shortBio}
          onChange={handleChange}
          rows={4}
          placeholder="BSc IT Graduate | MSc Data Science"
          disabled={!isEditing}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* ==================================================
          SAVE/CANCEL — only in edit mode; EDIT — only outside it.
          Same position for both, matching the Hero Section pattern.
      ================================================== */}

      {isEditing ? (
        <div className="pt-4 border-t border-slate-700 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-center sm:pt-5 md:pt-6 lg:justify-start lg:pt-7 xl:pt-8 2xl:pt-9">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || justEnteredEdit}
            className="
              w-full
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              hover:bg-blue-500
              hover:shadow-lg
              hover:shadow-blue-600/20
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
              sm:min-w-[200px]
              sm:px-6
              sm:py-3
              sm:text-base
              md:min-w-[220px]
              xl:min-w-[240px]
              xl:px-7
              xl:py-3.5
              xl:text-base
              2xl:min-w-[260px]
              2xl:px-8
              2xl:py-4
              2xl:text-lg
            "
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={saving}
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800/60
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-300
              transition
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
              sm:px-6
              sm:py-3
              sm:text-base
              xl:px-7
              xl:py-3.5
              2xl:px-8
              2xl:py-4
              2xl:text-lg
            "
          >
            Cancel
          </button>

        </div>
      ) : (
        <div className="pt-4 border-t border-slate-700 flex justify-center sm:pt-5 md:pt-6 lg:justify-start lg:pt-7 xl:pt-8 2xl:pt-9">

          <button
            type="button"
            onClick={handleEditClick}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              hover:bg-blue-500
              hover:shadow-lg
              hover:shadow-blue-600/20
              sm:w-auto
              sm:min-w-[200px]
              sm:px-6
              sm:py-3
              sm:text-base
              md:min-w-[220px]
              xl:min-w-[240px]
              xl:px-7
              xl:py-3.5
              xl:text-base
              2xl:min-w-[260px]
              2xl:px-8
              2xl:py-4
              2xl:text-lg
            "
          >
            <HiPencil className="text-base" />
            Edit About
          </button>

        </div>
      )}

    </div>
  );
}