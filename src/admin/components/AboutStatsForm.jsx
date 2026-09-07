import { useEffect, useState } from "react";
import {
  getAboutData,
  updateAboutData,
} from "../../firebase/firestore";

export default function AboutForm() {
  const [form, setForm] = useState({
    heading: "",
    description: "",
    role: "",
    experience: "",
    location: "",
    shortBio: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAboutData();

        if (data) {
          setForm({
            heading: data.heading || "",
            description: data.description || "",
            role: data.role || "",
            experience: data.experience || "",
            location: data.location || "",
            shortBio: data.shortBio || "",
            imageUrl: data.imageUrl || "",
          });
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
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let updatedImageUrl = form.imageUrl;

      if (imageFile) {
        // const downloadUrl = await uploadImageToStorage(imageFile);
        // updatedImageUrl = downloadUrl;
      }

      const finalData = {
        ...form,
        imageUrl: updatedImageUrl,
      };

      await updateAboutData(finalData);

      alert("About section updated successfully.");
    } catch (error) {
      console.error("Error updating About data:", error);
      alert("Failed to update About section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400">
        Loading About data...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <label className="block mb-2 text-gray-300 font-medium">
          Profile Photo
        </label>
        
        <div className="flex items-center gap-4">
          {form.imageUrl && (
            <img 
              src={form.imageUrl} 
              alt="Preview" 
              className="w-16 h-16 rounded-full object-cover border border-slate-600"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              p-3
              text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer
            "
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-gray-300 font-medium">
          Heading
        </label>

        <input
          type="text"
          name="heading"
          value={form.heading}
          onChange={handleChange}
          placeholder="About Me"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div>
        <label className="block mb-2 text-gray-300 font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          placeholder="Write your About description..."
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            resize-none
            focus:border-blue-500
          "
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 text-gray-300 font-medium">
            Role
          </label>

          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Data Analyst"
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              p-4
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-300 font-medium">
            Experience
          </label>

          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Data Analytics & IT Experience"
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              p-4
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>

      </div>

      <div>
        <label className="block mb-2 text-gray-300 font-medium">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Mumbai, Maharashtra"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div>
        <label className="block mb-2 text-gray-300 font-medium">
          Short Bio
        </label>

        <textarea
          name="shortBio"
          value={form.shortBio}
          onChange={handleChange}
          rows={4}
          placeholder="BSc IT Graduate | MSc Data Science"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            resize-none
            focus:border-blue-500
          "
        />
      </div>

      <div className="pt-4">

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}