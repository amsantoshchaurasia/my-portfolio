import Layout from "../components/Layout";
import HeroForm from "../components/HeroForm";

export default function Hero() {
  return (
    <Layout title="Hero Section">
      <div className="max-w-5xl xl:max-w-none">

        {/* PAGE HEADER — matches Skills.jsx: left-aligned, compact */}
        <div className="mb-4">

          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>

          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Hero Section
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Edit the information displayed on your portfolio homepage.
          </p>

        </div>

        {/* Form Card */}
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
            md:p-7
            lg:p-8
            2xl:p-12
          "
        >
          <HeroForm />
        </div>

      </div>
    </Layout>
  );
}