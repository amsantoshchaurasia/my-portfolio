import Layout from "../components/Layout";
import HeroForm from "../components/HeroForm";

export default function Hero() {
  return (
    <Layout title="Hero Section">
      <div className="max-w-5xl xl:max-w-none">

        {/* Page Header */}
        <div className="mb-6 text-center sm:mb-8 sm:text-left lg:mb-10 2xl:mb-12">

          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-blue-400 sm:text-xs sm:tracking-[3px] lg:text-sm lg:tracking-[5px]">
            Portfolio Management
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:mt-3 sm:text-3xl lg:text-4xl 2xl:text-5xl">
            Hero Section
          </h2>

          <p className="mt-2 text-xs text-gray-400 sm:mt-3 sm:text-sm lg:text-base 2xl:text-lg">
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