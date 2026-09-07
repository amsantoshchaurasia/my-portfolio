export default function Container({ children, className = "" }) {
  return (
    <div
      className={`w-full max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}