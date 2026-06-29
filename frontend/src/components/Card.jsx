function Card({ title, description, icon, darkMode }) {
  return (
    <div className={`group rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
      darkMode
        ? "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/80 hover:shadow-slate-950/30"
        : "bg-white border-slate-200/60 hover:shadow-slate-100/50"
    }`}>
      {/* Icon Wrapper */}
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon || "✨"}
      </div>

      <h3 className="text-xl font-bold tracking-tight">
        {title}
      </h3>

      <p className={`mt-3 text-sm leading-relaxed ${
        darkMode ? "text-slate-400" : "text-slate-600"
      }`}>
        {description}
      </p>

      <button className="mt-6 flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all cursor-pointer">
        Learn More <span className="transition-transform duration-200">→</span>
      </button>
    </div>
  );
}

export default Card;