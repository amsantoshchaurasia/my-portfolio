import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import CertificateCard from "./CertificateCard";
import { getCertificates } from "../../firebase/firestore";

export default function MajorCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD FEATURED CERTIFICATES
  // ======================================================

  useEffect(() => {
    let mounted = true;

    async function loadCertificates() {
      try {
        setLoading(true);
        setError("");

        const data = await getCertificates();

        console.log(
          "Featured certificates:",
          data
        );

        if (!mounted) {
          return;
        }

        const majorCertificates = data
          .filter(
            (certificate) =>
              !certificate.type ||
              certificate.type === "major" ||
              certificate.type === "Featured"
          )
          .sort(
            (a, b) =>
              Number(a.order || 1) -
              Number(b.order || 1)
          );

        setCertificates(majorCertificates);

      } catch (err) {

        console.error(
          "Error loading certificates:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load certificates right now."
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    }

    loadCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mt-12 sm:mt-14 lg:mt-16">

      {/* HEADER */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
        }}
        className="mb-8 sm:mb-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[3px] sm:tracking-[4px] text-blue-400">
          Featured
        </p>

        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
          Professional Certifications
        </h3>

        <div className="mt-3 h-1 w-14 sm:w-16 rounded-full bg-blue-500" />

        <p className="mt-3 sm:mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
          Industry-recognized certifications
          and virtual internship programs that
          demonstrate practical experience in
          Data Analytics, Business Intelligence
          and Data Science.
        </p>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-[340px]
                animate-pulse
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/70
              "
            />
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div
          className="
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/5
            p-6
            text-center
          "
        >
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        certificates.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-8
              text-center
            "
          >
            <p className="text-gray-500">
              No professional certificates available.
            </p>
          </div>
        )}

      {/* GRID */}
      {!loading &&
        !error &&
        certificates.length > 0 && (
          <div
            className="
              grid
              items-stretch
              gap-5
              sm:gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {certificates.map(
              (certificate, index) => (
                <motion.div
                  key={certificate.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay:
                      index * 0.1,
                  }}
                  className="flex h-full"
                >
                  <CertificateCard
                    certificate={
                      certificate
                    }
                  />
                </motion.div>
              )
            )}
          </div>
        )}

    </div>
  );
}