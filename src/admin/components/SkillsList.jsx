import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  getSkills,
  updateSkill,
  deleteSkill,
} from "../../firebase/firestore";

const SkillsList = forwardRef(function SkillsList(_, ref) {
  // ==================================================
  // STATE
  // ==================================================

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // ==================================================
  // LOAD SKILLS
  // ==================================================

  const loadSkills = useCallback(async (showLoader = true) => {
    try {
      setError("");

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const data = await getSkills();

      const sortedSkills = [...data].sort(
        (a, b) => Number(a.order || 0) - Number(b.order || 0)
      );

      setSkills(sortedSkills);
    } catch (err) {
      console.error("Error loading skills:", err);
      setError("Unable to load skills. Please check your Firebase connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSkills(true);
  }, [loadSkills]);

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => loadSkills(false),
    }),
    [loadSkills]
  );

  // ==================================================
  // FILTER DROPDOWN — close on outside click / Escape
  // ==================================================

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setFilterOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ==================================================
  // EDIT HANDLERS
  // ==================================================

  function handleEdit(skill) {
    setError("");

    setEditingSkill({
      id: skill.id,
      name: skill.name || "",
      category: skill.category || "analytics",
      icon: skill.icon || "",
      color: skill.color || "text-blue-400",
      order: skill.order || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditingSkill((prev) => ({ ...prev, [name]: value }));
  }

  function handleCancelEdit() {
    if (saving) return;
    setEditingSkill(null);
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (!editingSkill) return;

    if (!editingSkill.name?.trim()) {
      alert("Please enter skill name.");
      return;
    }

    if (!editingSkill.icon?.trim()) {
      alert("Please enter icon name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateSkill(editingSkill.id, {
        name: editingSkill.name.trim(),
        category: editingSkill.category || "analytics",
        icon: editingSkill.icon.trim(),
        color: editingSkill.color?.trim() || "text-blue-400",
        order: Number(editingSkill.order) || 1,
      });

      setEditingSkill(null);
      await loadSkills(false);
      alert("Skill updated successfully.");
    } catch (err) {
      console.error("Error updating skill:", err);
      setError("Failed to update skill. Please try again.");
      alert("Failed to update skill.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill) {
    const confirmed = window.confirm(`Delete "${skill.name}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(skill.id);
      setError("");

      await deleteSkill(skill.id);

      if (editingSkill?.id === skill.id) {
        setEditingSkill(null);
      }

      await loadSkills(false);
      alert("Skill deleted successfully.");
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError("Failed to delete skill. Please try again.");
      alert("Failed to delete skill.");
    } finally {
      setDeletingId(null);
    }
  }

  function getCategoryLabel(category) {
    switch (category) {
      case "analytics":
        return "Data Analytics";
      case "web":
        return "Web Development";
      case "tools":
        return "Tools & Technologies";
      default:
        return category || "Other";
    }
  }

  // Added `accent` — a small left-edge color strip on each mobile/tablet
  // card, so category is readable at a glance without needing to read
  // the badge text first.
  function getCategoryColors(category) {
    switch (category) {
      case "web":
        return {
          text: "text-yellow-400",
          badge: "bg-yellow-500/10 text-yellow-400",
          accent: "bg-yellow-400/80",
        };
      case "tools":
        return {
          text: "text-blue-400",
          badge: "bg-blue-500/10 text-blue-400",
          accent: "bg-blue-400/80",
        };
      case "analytics":
      default:
        return {
          text: "text-purple-400",
          badge: "bg-purple-500/10 text-purple-400",
          accent: "bg-purple-400/80",
        };
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="mt-5 rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-blue-500" />
        <p className="mt-2.5 text-xs text-gray-500">Loading skills...</p>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 " +
    "text-sm text-white outline-none transition focus:border-blue-500 " +
    "focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/30";

  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  const filterTabs = [
    { id: "all", label: "All Skills" },
    { id: "analytics", label: "Data Analytics" },
    { id: "web", label: "Web Development" },
    { id: "tools", label: "Tools & Technologies" },
  ];

  const filteredSkills =
    activeFilter === "all"
      ? skills
      : skills.filter((skill) => (skill.category || "analytics") === activeFilter);

  const activeTab = filterTabs.find((tab) => tab.id === activeFilter);

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="mt-5">
      {error && (
        <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">Existing skills</h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            Manage skills shown on your portfolio.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-gray-300">
            {skills.length} {skills.length === 1 ? "skill" : "skills"}
          </span>

          <button
            type="button"
            onClick={() => loadSkills(false)}
            disabled={refreshing}
            aria-label="Refresh skills"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700
              bg-slate-800/60 text-gray-300 transition hover:border-blue-500/50 hover:text-white
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 fill-none stroke-current stroke-2 ${refreshing ? "animate-spin" : ""}`}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER — custom dropdown */}
      <div className="relative z-20 mb-4 sm:max-w-xs" ref={filterRef}>
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={filterOpen}
          className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-slate-800/60
            px-3.5 py-2.5 text-left text-sm text-white outline-none transition
            ${filterOpen ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
            </svg>
            <span className="truncate">{activeTab?.label}</span>
          </span>

          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400 transition-transform duration-200 ${
              filterOpen ? "rotate-180" : ""
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {filterOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-lg
              border border-slate-700 bg-[#182233] shadow-xl shadow-black/40"
          >
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? skills.length
                  : skills.filter((s) => (s.category || "analytics") === tab.id).length;

              const isActive = tab.id === activeFilter;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm
                    transition border-b border-slate-800/70 last:border-b-0
                    ${isActive ? "bg-blue-500/15 text-blue-400" : "text-gray-300 hover:bg-slate-800/80"}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      {isActive && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 fill-none stroke-current stroke-[3]"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-700/60 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT FORM */}
      {editingSkill && (
        <div className="mb-4 rounded-xl border border-blue-500/25 bg-[#111827] p-4">
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                Skill management
              </p>
              <h3 className="mt-1 text-sm font-semibold text-white">Edit skill</h3>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              aria-label="Cancel edit"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border
                border-slate-700 bg-slate-800/60 text-gray-400 transition hover:text-white
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Skill name</label>
                <input
                  type="text"
                  name="name"
                  value={editingSkill.name}
                  onChange={handleEditChange}
                  placeholder="Python"
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Category</label>
                <select
                  name="category"
                  value={editingSkill.category || "analytics"}
                  onChange={handleEditChange}
                  className={inputClasses}
                >
                  <option value="analytics">Data Analytics</option>
                  <option value="web">Web Development</option>
                  <option value="tools">Tools & Technologies</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Icon name</label>
                <input
                  type="text"
                  name="icon"
                  value={editingSkill.icon}
                  onChange={handleEditChange}
                  placeholder="SiPython"
                  required
                  className={inputClasses}
                />
                <p className="mt-1 text-[11px] text-gray-600">
                  e.g. SiPython, SiReact, SiMysql
                </p>
              </div>

              <div>
                <label className={labelClasses}>Icon color</label>
                <input
                  type="text"
                  name="color"
                  value={editingSkill.color}
                  onChange={handleEditChange}
                  placeholder="text-blue-400"
                  className={inputClasses}
                />
                <p className="mt-1 text-[11px] text-gray-600">e.g. text-yellow-400</p>
              </div>
            </div>

            <div className="sm:max-w-[160px]">
              <label className={labelClasses}>Display order</label>
              <input
                type="number"
                name="order"
                min="1"
                value={editingSkill.order}
                onChange={handleEditChange}
                placeholder="1"
                className={inputClasses}
              />
              <p className="mt-1 text-[11px] text-gray-600">Lower numbers appear first.</p>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-3.5 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold
                  text-white transition hover:bg-blue-500 disabled:cursor-not-allowed
                  disabled:opacity-60 sm:w-auto sm:px-6"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5
                  text-sm font-semibold text-gray-300 transition hover:text-white
                  disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredSkills.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
            +
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">
            {skills.length === 0 ? "No skills yet" : "No skills in this category"}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {skills.length === 0
              ? "Add your first skill using the form above."
              : "Try a different filter or add a new skill above."}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE / TABLET CARDS (below lg)
              — single row per skill: leading order badge + name/category
              stacked on the left, actions trailing on the right. A thin
              category-colored accent strip on the left edge makes each
              card's category readable at a glance. */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:hidden">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group relative overflow-hidden rounded-xl border border-slate-800
                  bg-[#111827] py-3 pl-4 pr-3 transition hover:border-slate-700"
              >
                {/* Category accent strip — rounded to match the card's
                    own corners so it doesn't poke out as a sharp edge */}
                <span
                  className={`absolute inset-y-0 left-0 w-[3px] rounded-l-xl ${getCategoryColors(skill.category).accent}`}
                />

                <div className="flex items-center justify-between gap-3">
                  {/* LEADING: order + name/category */}
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                        bg-slate-800/80 text-xs font-bold text-gray-300 ring-1 ring-slate-700/80"
                    >
                      {skill.order || "-"}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {skill.name || "Unnamed skill"}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium
                          ${getCategoryColors(skill.category).badge}`}
                      >
                        {getCategoryLabel(skill.category)}
                      </span>
                    </div>
                  </div>

                  {/* TRAILING: actions */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(skill)}
                      disabled={deletingId === skill.id}
                      aria-label={`Edit ${skill.name || "skill"}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700
                        bg-slate-800/60 text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(skill)}
                      disabled={deletingId === skill.id}
                      aria-label={`Delete ${skill.name || "skill"}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700
                        bg-slate-800/60 text-gray-300 transition hover:border-red-500/40 hover:text-red-400
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === skill.id ? (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-spin fill-none stroke-current stroke-2">
                          <path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                          <polyline points="3 6 5 6 21 6" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE (lg and up) */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-800 bg-[#111827] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-slate-800 bg-slate-800/40">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                      Order
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                      Skill
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                      Category
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                      Icon
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSkills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="border-b border-slate-800/70 transition last:border-b-0 hover:bg-slate-800/30"
                    >
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex h-6 min-w-6 items-center justify-center rounded-md
                            bg-slate-800 px-2 text-xs font-bold text-indigo-400 ring-1 ring-slate-700"
                        >
                          {skill.order || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-white">
                          {skill.name || "Unnamed skill"}
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryColors(skill.category).badge}`}
                        >
                          {getCategoryLabel(skill.category)}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <code className="rounded-md bg-slate-800/70 px-2 py-1 text-xs text-gray-400">
                          {skill.icon || "-"}
                        </code>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(skill)}
                            disabled={deletingId === skill.id}
                            className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3
                              py-1.5 text-xs font-semibold text-blue-400 transition
                              hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(skill)}
                            disabled={deletingId === skill.id}
                            className="rounded-lg border border-red-500/25 bg-red-500/10 px-3
                              py-1.5 text-xs font-semibold text-red-400 transition
                              hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === skill.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default SkillsList;