import { motion } from "motion/react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const samples = [
  {
    title: "Boda Clásica",
    category: "Bodas",
    image: "https://picsum.photos/seed/boda_clasica/600/800",
    gradient: "from-amber-500/20 to-purple-500/20",
  },
  {
    title: "Boda Rústica",
    category: "Bodas",
    image: "https://picsum.photos/seed/boda_rustica/600/800",
    gradient: "from-emerald-500/20 to-amber-500/20",
  },
  {
    title: "Cumpleaños Infantil",
    category: "Cumpleaños",
    image: "https://picsum.photos/seed/cumpleanos_infantil/600/800",
    gradient: "from-pink-500/20 to-yellow-500/20",
  },
  {
    title: "Baby Shower",
    category: "Bebés",
    image: "https://picsum.photos/seed/baby_shower/600/800",
    gradient: "from-blue-500/20 to-pink-500/20",
  },
  {
    title: "Graduación",
    category: "Eventos",
    image: "https://picsum.photos/seed/graduacion/600/800",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    title: "Bautizo",
    category: "Relamigos",
    image: "https://picsum.photos/seed/bautizo/600/800",
    gradient: "from-sky-500/20 to-indigo-500/20",
  },
  {
    title: "Aniversario",
    category: "Parejas",
    image: "https://picsum.photos/seed/aniversario/600/800",
    gradient: "from-rose-500/20 to-amber-500/20",
  },
  {
    title: "Bosque Encantado",
    category: "Temáticas",
    image: "https://picsum.photos/seed/bosque/600/800",
    gradient: "from-emerald-600/20 to-teal-500/20",
  },
  {
    title: "Bridgerton Style",
    category: "Elegancia",
    image: "https://picsum.photos/seed/bridgerton/600/800",
    gradient: "from-violet-500/20 to-rose-500/20",
  },
  {
    title: "Elegancia Celestial",
    category: "Premium",
    image: "https://picsum.photos/seed/elegancia/600/800",
    gradient: "from-blue-600/20 to-indigo-900/20",
  },
];

export default function SamplesAltair() {
  return (
    <section className="py-28 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden" id="muestras">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Diseños Exclusivos</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Muestras para todo tipo de eventos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            Personalizamos cada detalle a tu gusto (música, colores, tipografías y temática sin costo extra). Explora algunos de nuestros estilos favoritos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {samples.map((sample, index) => (
            <motion.div
              key={sample.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-3xl overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[3/4] overflow-hidden relative bg-gray-100">
                <div className={`absolute inset-0 bg-gradient-to-t ${sample.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`} />
                <img
                  src={sample.image}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                    {sample.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between bg-white relative z-20">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Totalmente personalizable</p>
                </div>
                <Link
                  to="/select-template"
                  className="w-10 h-10 rounded-2xl bg-gray-50 group-hover:bg-primary-600 group-hover:text-white text-gray-700 flex items-center justify-center transition-all duration-300 shadow-sm"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/select-template"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gray-900 hover:bg-primary-600 rounded-2xl transition-all duration-300 shadow-xl shadow-gray-900/10 hover:shadow-primary-500/25"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explorar todas las plantillas y comenzar
          </Link>
        </div>
      </div>
    </section>
  );
}
