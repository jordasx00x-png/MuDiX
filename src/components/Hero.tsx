import { motion } from "motion/react";
import { CheckCircle2, Wand2, Sparkles, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 lg:pt-52 lg:pb-36 overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white">
      {/* Dynamic Glow Background Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 border border-primary-200 text-primary-700 text-sm font-medium mb-8 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
            <span>La nueva era de invitaciones digitales inteligentes</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-[1.1]"
          >
            Crea tu invitación digital para{" "}
            <span className="bg-gradient-to-r from-primary-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              cualquier evento
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Diseña, comparte y organiza tu evento con música, confirmación de asistencia en tiempo real y estilo impecable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/select-template"
              className="group relative inline-flex items-center justify-center px-9 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-rose-600 rounded-2xl hover:from-primary-700 hover:to-rose-700 transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Wand2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              <span>Crear mi invitación</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              to="#muestras"
              href="#muestras"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white/80 hover:bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto backdrop-blur-md"
            >
              Ver ejemplos
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-xl shadow-gray-200/50"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-primary-100 text-primary-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Personalizable</h3>
                <p className="text-sm text-gray-500 mt-0.5">Colores, música y tipografías a tu gusto.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lista para Compartir</h3>
                <p className="text-sm text-gray-500 mt-0.5">Enlace directo por WhatsApp y redes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">RSVP en Vivo</h3>
                <p className="text-sm text-gray-500 mt-0.5">Control de invitados y confirmaciones.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
