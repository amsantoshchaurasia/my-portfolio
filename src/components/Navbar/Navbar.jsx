import Button from "../Common/Button";

const navLinks = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Certificates",
  "Contact",
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-20">

        <div className="mt-4 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl">

          <div className="h-20 flex items-center justify-between px-8">

            {/* Logo */}
            <h1 className="text-2xl font-black tracking-wide">
              <span className="text-white">Santosh</span>
              <span className="text-blue-500">.</span>
            </h1>

            {/* Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-10">

                {navLinks.map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-300 hover:text-blue-400 transition duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}

              </ul>
            </nav>

            {/* Resume */}
            <Button>
              Resume
            </Button>

          </div>

        </div>

      </div>
    </header>
  );
}