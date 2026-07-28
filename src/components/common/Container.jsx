export default function Container({ children, className = "" }) {
  return (
    <div
      className={`max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-24 ${className}`}
    >
      {children}
    </div>
  );
}