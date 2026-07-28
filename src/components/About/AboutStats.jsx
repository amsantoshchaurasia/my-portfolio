const stats = [
  {
    number: "10+",
    title: "Projects",
  },
  {
    number: "15+",
    title: "Certificates",
  },
  {
    number: "8.70",
    title: "CGPA",
  },
  {
    number: "1+",
    title: "Experience",
  },
];

export default function AboutStats() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-slate-900 rounded-3xl p-8 border border-slate-700 text-center"
        >
          <h2 className="text-5xl font-black text-blue-500">
            {item.number}
          </h2>

          <p className="mt-4 text-gray-400">
            {item.title}
          </p>
        </div>
      ))}

    </div>
  );
}