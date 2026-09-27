import { getTechColor } from "../../utils/colors/techColors";

export default function TechBadge({ name }) {
  return (

    <span
      className={`
      px-2.5
      py-1
      sm:px-4
      sm:py-2

      rounded-full

      text-xs
      sm:text-sm
      font-medium

      bg-slate-800/60

      border

      ${getTechColor(name)}
      `}
    >
      {name}
    </span>

  );
}