import { motion } from "motion/react";
import {
  Palette,
  Share2,
  LayoutList,
  CheckSquare,
  QrCode,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Palette className="w-7 h-7 text-primary-600" />,
    bg: "bg-primary-100",
    title: "100% Personalizable a tu gusto",
    description: "Modifica colores, música de fondo, tipografías y secciones completas sin costo extra.",
  },
  {
    icon: <Share2 className="w-7 h-7 text-rose-600" />,
    bg: "bg-rose-100",
    title: "Lista para compartir en segundos",
    description: "Comparte tu enlace exclusivo por WhatsApp, redes sociales o correo con un solo toque.",
  },
  {
    icon: <LayoutList className="w-7 h-7 text-purple-600" />,
    bg: "bg-purple-100",
    title: "Información Clara e Interactiva",
    description: "Ubicación con mapas, itinerario detallado, código de vestimenta y mesa de regalos integrados.",
  },
  {
    icon: <CheckSquare className="w-7 h-7 text-emerald-600" />,
    bg: "bg-emerald-100",
    title: "RSVP y Control de Asistencia",
    description: "Monitorea en tiempo real quién asistirá, número de pases y comentarios de tus invitados.",
  },
  {
    icon: <QrCode className="w-7 h-7 text-blue-600" />,
    bg: "bg-blue-100",
    title: "Pases Digitales con Código QR",
    description: "Generación de pases personalizados para cada invitado y control de acceso profesional en la entrada.",
  },
  {
    icon: <ImageIcon className="w-7 h-7 text-amber-600" />,
    bg: "bg-amber-100",
    title: "Galería de Fotos Colaborativa",
    description: "Permite que tus invitados compartan y suban las fotos del evento en vivo desde su celular.",
  },
];

export default function Features() {
  return (
    <section className="py-28 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 relative overflow-hidden" id="caracteristicas">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Ventajas Exclusivas</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
          >
            ¿Por qué elegir nuestras invitaciones digitales?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            Todo lo que necesitas para organizar tu evento con elegancia, control absoluto y tecnología de punta.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
