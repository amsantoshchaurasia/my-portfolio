export default function TechBadge({ name }) {
  return (

    <span
      className="
      px-4
      py-2

      rounded-full

      text-sm
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