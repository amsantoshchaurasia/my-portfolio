export default function Button({
  children,
  variant = "primary",
  onClick,
}) {
  const baseStyle =
    "px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white",

    outline:
      "border border-blue-500 text-white hover:bg-blue-600 hover:scale-105",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}