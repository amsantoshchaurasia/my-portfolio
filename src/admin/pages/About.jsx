import Layout from "../components/Layout";
import AboutForm from "../components/AboutForm";

export default function About() {
  return (
    <Layout title="About Section">
      <div className="max-w-5xl">
        {/* Page Header */}
        <div className="mb-10">
          <p className="uppercase tracking-[5px] text-blue-400 text-sm font-semibold">
            Portfolio Management
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            About Section
          </h2>

          <p className="mt-3 text-gray-400">
            Edit the information displayed in the About section of your
            portfolio.
          </p>
        </div>

        {/* About Information */}
        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-8
            shadow-xl
          "
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            About Information
          </h3>

          <AboutForm />
        </div>
      </div>
    </Layout>
  );
}