function Card({ title, description, icon, darkMode }) {
  return (
    <div className={`group rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
      darkMode
        ? "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:shadow-slate-950/50"
        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
    }`}>
      {/* Icon Wrapper */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 ${
        darkMode 
          ? "bg-blue-500/15 text-blue-400" 
          : "bg-blue-100 text-blue-600"
      }`}>
        {icon || "✨"}
      </div>

      <h3 className={`text-xl font-bold tracking-tight ${
        darkMode ? "text-slate-100" : "text-slate-900"
      }`}>
        {title}
      </h3>

      <p className={`mt-3 text-sm leading-relaxed ${
        darkMode ? "text-slate-400" : "text-slate-600"
      }`}>
        {description}
      </p>

      <button className={`mt-6 flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all cursor-pointer ${
        darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
      }`}>
        Learn More <span className="transition-transform duration-200">→</span>
      </button>
    </div>
  );
}

export default Card;