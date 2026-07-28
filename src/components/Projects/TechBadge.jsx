export default function TechBadge({ name }) {
  return (
    <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm border border-blue-500/30">
      {name}
    </span>
  );
}