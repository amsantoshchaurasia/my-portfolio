import Layout from "../components/Layout";
import AboutForm from "../components/AboutForm";

export default function About() {
  return (
    <Layout title="About Section">
      <div className="max-w-5xl xl:max-w-none">

        {/* Page Header */}
        <div className="mb-5 text-center sm:mb-8 sm:text-left md:mb-9 lg:mb-10 xl:mb-11 2xl:mb-12">

          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-blue-400 sm:text-xs sm:tracking-[3px] lg:text-sm lg:tracking-[5px] xl:text-sm 2xl:text-base">
            Portfolio Management
          </p>

          <h2 className="mt-1.5 text-2xl font-black text-white sm:mt-3 sm:text-3xl lg:text-4xl 2xl:text-5xl">
            About Section
          </h2>

          <p className="mt-1.5 text-xs text-gray-400 sm:mt-3 sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl">
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
          <h3 className="mb-4 text-base font-bold text-white text-center sm:mb-6 sm:text-lg sm:text-left md:text-xl lg:mb-7 xl:text-2xl 2xl:text-3xl 2xl:mb-8">
            About Information
          </h3>

          <AboutForm />
        </div>

      </div>
    </Layout>
  );
}