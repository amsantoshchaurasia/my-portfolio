import { FiFileText } from "react-icons/fi";
import Button from "../common/Button";

export default function CertificateCard({ certificate }) {
  // Uses an "imageUrl" field if present in Firestore data.
  // Falls back to a placeholder icon if no image has been added yet.
  const imageUrl = certificate?.imageUrl || certificate?.image || null;

  // The admin form saves the uploaded PDF under "fileUrl".
  // "pdf" is kept as a fallback for any older/manually-added entries.
  const certificateUrl = certificate?.fileUrl || certificate?.pdf || null;

  return (
    <div
      className="
      flex
      h-full
      w-full
      flex-col
      justify-between

      overflow-hidden
      rounded-3xl
      border
      border-slate-700
      bg-[#111827]

      transition-all
      duration-300

      hover:-translate-y-2
      hover:border-blue-500
      hover:shadow-[0_0_35px_rgba(37,99,235,.25)]
      "
    >
      {/* Certificate Image - fixed height */}
      <div className="relative h-24 sm:h-28 md:h-32 w-full shrink-0 bg-slate-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={certificate?.title || "Certificate"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800/60">
            <FiFileText size={28} className="text-slate-600" />
          </div>
        )}

        {certificate?.year && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-blue-600/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {certificate.year}
          </span>
        )}
      </div>

      {/* Content - height follows content, no forced gap */}
      <div className="flex flex-col gap-4 p-4 sm:p-5 md:p-6">
        <div>
          {/* Company */}
          {certificate?.company && (
            <span className="mb-2 inline-flex w-fit rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
              {certificate.company}
            </span>
          )}

          {/* Title */}
          <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-white">
            {certificate?.title}
          </h3>
        </div>

        {/* Button */}
        {certificateUrl ? (
          <Button
            className="w-full justify-center"
            onClick={() => window.open(certificateUrl, "_blank")}
          >
            View Certificate
          </Button>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm text-gray-500">
            <FiFileText size={16} />
            Certificate unavailable
          </div>
        )}
      </div>
    </div>
  );
}