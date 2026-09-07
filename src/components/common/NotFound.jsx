import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-[#0B1120] text-white min-h-screen flex items-center justify-center pt-24 pb-16">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[120px]" />

      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          {/* Large 404 Text */}
          <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            404
          </h1>

          {/* Subheading */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-4">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Home Button */}
          <div className="flex justify-center">
            <Link to="/">
              <Button>
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}