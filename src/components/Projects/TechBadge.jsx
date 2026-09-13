export default function TechBadge({ name }) {
  return (

    <span
      className="
      px-2.5
      py-1
      sm:px-4
      sm:py-2

      rounded-full

      text-xs
      sm:text-sm
      font-medium

      bg-blue-600/10

      border
      border-blue-500/30

      text-blue-400
      "
    >
      {name}
    </span>

  );
}