import { motion } from "motion/react";
import { CheckCircle2, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-90" />
        <img
          src="https://picsum.photos/seed/eventos/1920/1080?blur=2"
          alt="Fondo de eventos"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Crea tu invitación digital para{" "}
            <span className="text-primary-600">cualquier evento</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 mb-10"
          >
            Diseña, organiza y controla tu evento desde una sola invitación
            digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/select-template"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Crear mi invitación
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-6 text-left"
          >
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-primary-500 mr-3 shrink-0" />
              <p className="text-gray-700">
                Crea tu invitación digital a tu gusto
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-primary-500 mr-3 shrink-0" />
              <p className="text-gray-700">
                Lista para compartir con tus invitados
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-primary-500 mr-3 shrink-0" />
              <p className="text-gray-700">
                Control de confirmación en tiempo real
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
