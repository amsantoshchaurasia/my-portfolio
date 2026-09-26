import Layout from "../components/Layout";
import AboutForm from "../components/AboutForm";

export default function About() {
  return (
    <Layout title="About Section">
      <div className="max-w-5xl xl:max-w-none">

        {/* PAGE HEADER — matches Skills.jsx: left-aligned, compact */}
        <div className="mb-4">

          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>

          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            About Section
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Edit the information displayed in the About section of your portfolio.
          </p>

        </div>

        {/* About Information */}
        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-[#111827]
            p-4
            shadow-xl
            sm:rounded-3xl
            sm:p-6
            md:p-8
            lg:p-8
            xl:p-10
            2xl:p-12
          "
        >
          <h3 className="mb-4 text-left text-base font-bold text-white sm:mb-6 sm:text-lg md:text-xl">
            About Information
          </h3>

          <AboutForm />
        </div>

      </div>
    </Layout>
  );
}