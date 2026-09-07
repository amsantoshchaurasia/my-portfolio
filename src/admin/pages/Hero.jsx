import Layout from "../components/Layout";
import HeroForm from "../components/HeroForm";

export default function Hero() {
  return (
    <Layout title="Hero Section">
      <div className="max-w-5xl">
        {/* Page Header */}
        <div className="mb-10">
          <p className="uppercase tracking-[5px] text-blue-400 text-sm font-semibold">
            Portfolio Management
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Hero Section
          </h2>

          <p className="mt-3 text-gray-400">
            Edit the information displayed on your portfolio homepage.
          </p>
        </div>

        {/* Form Card */}
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
          <HeroForm />
        </div>
      </div>
    </Layout>
  );
}