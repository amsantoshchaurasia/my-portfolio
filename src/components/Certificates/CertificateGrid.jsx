import Button from "../common/Button";

export default function CertificateCard({ certificate }) {
  return (
    <div
      className="
      rounded-3xl
      bg-[#111827]
      border
      border-slate-700

      p-7

      flex
      flex-col
      justify-between

      transition-all
      duration-300

      hover:-translate-y-2
      hover:border-blue-500
      hover:shadow-[0_0_35px_rgba(37,99,235,.25)]
      "
    >
      <div>
        {/* Header */}

        <div className="flex justify-between items-center">

          <span className="uppercase tracking-[4px] text-xs text-gray-500">
            Certificate
          </span>

          <span className="bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full">
            {certificate.year}
          </span>

        </div>

        {/* Title */}

        <h3 className="mt-6 text-2xl font-bold leading-tight text-white">
          {certificate.title}
        </h3>

        {/* Company */}

        <span className="inline-flex mt-5 w-fit rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
          {certificate.company}
        </span>

        {/* Description */}

        <p className="mt-5 text-gray-400 leading-7">
          {certificate.description}
        </p>

      </div>

      {/* Button */}

      <div className="mt-8">

        <Button
          className="w-full justify-center"
          onClick={() => window.open(certificate.pdf, "_blank")}
        >
          View Certificate
        </Button>

      </div>

    </div>
  );
}