function Card({ title, description }) {
    return (
        <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition duration-300">

            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl mb-6">
                ✨
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
                {title}
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
                {description}
            </p>

            <button className="mt-6 font-semibold text-blue-600 group-hover:text-purple-600 transition">
                Learn More →
            </button>

        </div>
    );
}

export default Card;