export default function TypingName({ firstName, lastName }) {
  return (
    <div>
      {/* Small Greeting */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-[2px] bg-blue-500"></div>
        <span className="uppercase tracking-[8px] text-blue-400 text-sm font-semibold">
          HELLO I'M
        </span>
      </div>

      {/* Big Name */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
        <div className="text-white mb-2">{firstName.toUpperCase()}</div>
        <div className="text-blue-500">{lastName.toUpperCase()}</div>
      </h1>
    </div>
  );
}