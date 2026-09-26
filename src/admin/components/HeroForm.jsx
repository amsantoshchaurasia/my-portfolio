import { useEffect, useState } from "react";
import {
  getHeroData,
  updateHeroData,
} from "../../firebase/firestore";
import { uploadPhotoFile } from "../../firebase/storage";
import { HiCamera, HiPencil } from "react-icons/hi";

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
    phone: "", // kept in state — field is commented out below, not removed
    location: "",
    github: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    imageUrl: "",
  };

  // ======================================================
  // STATE
  // ======================================================

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState(initialForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Guards against the "ghost click" issue on touch devices: tapping
  // "Edit Hero" swaps that exact spot for the "Save Changes" submit
  // button, and a delayed synthetic click can land on the new button
  // and submit the form instantly. This blocks submits for a brief
  // window right after entering edit mode.
  const [justEnteredEdit, setJustEnteredEdit] = useState(false);

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
          const loadedForm = {
            ...initialForm,
            ...data,
          };

          setForm(loadedForm);
          setOriginalForm(loadedForm);

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
  // ENTER EDIT MODE
  // ======================================================

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccess("");
    setError("");

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
    setSuccess("");
    setError("");
  };

  // ======================================================
  // SAVE HERO DATA
  // ======================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving || justEnteredEdit) return;

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
      setOriginalForm(finalData);
      setImageFile(null);
      setIsEditing(false);

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
    xl:px-5
    xl:py-3.5
    2xl:py-4
    2xl:text-lg
  `;

  // ======================================================
  // UI
  // ======================================================

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 sm:space-y-8 xl:space-y-9 2xl:space-y-10"
    >

      {/* ==================================================
          PROFILE PHOTO SECTION
      ================================================== */}


      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">

        {/* AVATAR + EDIT BADGE (native file input hidden, triggered via label) */}
        <div className="relative w-28 h-28 shrink-0 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40">

          {imagePreview ? (
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
              <img
                src={imagePreview}
                alt="Hero Preview"
                className="h-full w-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-center text-xs text-gray-500">
              No Image
            </div>
          )}

          <label
            htmlFor="heroImageInput"
            className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[#111827] bg-blue-600 text-white shadow-md transition-all hover:bg-blue-500 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12"
          >
            <HiCamera className="text-base sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" />
          </label>

          <input
            id="heroImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-white sm:text-sm md:text-base xl:text-lg 2xl:text-xl">
            Profile Photo
          </p>
        </div>

      </div>

      {/* ==================================================
          PERSONAL INFORMATION
      ================================================== */}

      <div className="pt-5 border-t border-slate-700 text-center sm:pt-6 sm:text-left xl:pt-7 2xl:pt-8">
        <h3 className="text-base font-bold text-white sm:text-lg md:text-xl xl:text-2xl">
          Personal Information
        </h3>

        <p className="mt-1 text-xs text-gray-400 sm:text-sm xl:text-base 2xl:text-lg">
          Basic information displayed in your portfolio Hero section.
        </p>
      </div>

      {/* ==================================================
          NAME + TITLE — one row of 3 only at 2xl, so the wide
          screen isn't spent on two skinny name fields with a
          near-empty row beneath them
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-8">

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        {/* TITLE — moves into this row only at 2xl; keeps its own
            full-width block below for every smaller size */}
        <div className="hidden 2xl:block">
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            Professional Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Data Analyst"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

      </div>

      {/* ==================================================
          TITLE — shown here for sizes 1-5; hidden at 2xl since
          it moves into the Name row above
      ================================================== */}

      <div className="2xl:hidden">
        <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base">
          Professional Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Data Analyst"
          disabled={!isEditing}
          className={inputClass}
        />
      </div>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <div>
        <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write a short professional introduction..."
          rows={5}
          disabled={!isEditing}
          className={`${inputClass} resize-y sm:rows-6 2xl:rows-5`}
        />

        <p className="mt-1.5 text-[11px] text-slate-500 sm:mt-2 sm:text-xs xl:text-sm 2xl:text-base">
          Keep the description professional and concise.
        </p>
      </div>

      {/* ==================================================
          CONTACT INFORMATION
      ================================================== */}

      <div className="pt-5 border-t border-slate-700 text-center sm:pt-6 sm:text-left xl:pt-7 2xl:pt-8">

        <h3 className="text-base font-bold text-white sm:text-lg md:text-xl xl:text-2xl">
          Contact Information
        </h3>

        <p className="mt-1 text-xs text-gray-400 sm:text-sm xl:text-base 2xl:text-lg">
          Contact details displayed on your portfolio.
        </p>

      </div>

      {/* EMAIL + LOCATION — sits side-by-side from xl up so
          size 1-4 (mobile/sm/md/lg) keep their existing stacked look */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6 xl:gap-8 2xl:gap-8">

        {/* EMAIL */}

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        {/* PHONE — currently not used/displayed anywhere on the public site.
            Commented out (not removed) so the field + saved data stay intact
            and this can be re-enabled instantly if needed later.

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
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

        */}

        {/* LOCATION */}

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Maharashtra, India"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

      </div>

      {/* ==================================================
          SOCIAL LINKS
      ================================================== */}

      <div className="pt-5 border-t border-slate-700 text-center sm:pt-6 sm:text-left xl:pt-7 2xl:pt-8">

        <h3 className="text-base font-bold text-white sm:text-lg md:text-xl xl:text-2xl">
          Social Profiles
        </h3>

        <p className="mt-1 text-xs text-gray-400 sm:text-sm xl:text-base 2xl:text-lg">
          Add links to your professional social profiles. Leave a field empty to hide that icon on your portfolio.
        </p>

      </div>

      {/* All four social fields in ONE grid so that at 2xl they can
          form a single clean row of 4 instead of two half-empty-looking
          rows of 2 — sizes 1-5 are untouched (still md:grid-cols-2) */}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-6">

        {/* GITHUB */}

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            GitHub URL
          </label>

          <input
            type="url"
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        {/* LINKEDIN */}

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            LinkedIn URL
          </label>

          <input
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        {/* INSTAGRAM */}

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            Instagram URL
          </label>

          <input
            type="url"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/username"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

        {/* FACEBOOK */}

        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm xl:text-base 2xl:text-lg">
            Facebook URL
          </label>

          <input
            type="url"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/username"
            disabled={!isEditing}
            className={inputClass}
          />
        </div>

      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 sm:px-4 sm:py-3 xl:px-5 xl:py-3.5 2xl:px-6 2xl:py-4">
          <p className="text-xs text-emerald-400 sm:text-sm xl:text-base 2xl:text-lg">
            ✓ {success}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 sm:px-4 sm:py-3 xl:px-5 xl:py-3.5 2xl:px-6 2xl:py-4">
          <p className="text-xs text-red-400 sm:text-sm xl:text-base 2xl:text-lg">
            {error}
          </p>
        </div>
      )}

      {/* ==================================================
          SAVE / CANCEL BUTTONS — only shown while editing
          — left-aligned everywhere, centered only at md (tablet)
      ================================================== */}

      {isEditing ? (
        <div className="pt-5 border-t border-slate-700 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-start sm:pt-6 md:justify-center lg:justify-start xl:pt-7 2xl:pt-8">

          <button
            type="submit"
            disabled={saving || justEnteredEdit}
            className="
              w-full
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              text-white
              font-semibold
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
              xl:min-w-[220px]
              xl:px-7
              xl:py-3.5
              2xl:min-w-[240px]
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
        <div className="pt-5 border-t border-slate-700 flex justify-start sm:pt-6 md:justify-center lg:justify-start xl:pt-7 2xl:pt-8">

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
              text-white
              font-semibold
              transition-all
              hover:bg-blue-500
              hover:shadow-lg
              hover:shadow-blue-600/20
              sm:w-auto
              sm:min-w-[200px]
              sm:px-6
              sm:py-3
              sm:text-base
              xl:min-w-[220px]
              xl:px-7
              xl:py-3.5
              2xl:min-w-[240px]
              2xl:px-8
              2xl:py-4
              2xl:text-lg
            "
          >
            <HiPencil className="text-base" />
            Edit Hero
          </button>

        </div>
      )}

    </form>
  );
}