import { motion } from "motion/react";
import {
  Palette,
  Share2,
  LayoutList,
  CheckSquare,
  QrCode,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Palette className="w-8 h-8 text-primary-500" />,
    title: "Crea tu invitación digital a tu gusto",
    description:
      "Personaliza colores, tipografías, música y temática fácilmente.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-primary-500" />,
    title: "Lista para compartir con tus invitados",
    description:
      "Envíala fácilmente por WhatsApp, Facebook, Instagram o correo electrónico.",
  },
  {
    icon: <LayoutList className="w-8 h-8 text-primary-500" />,
    title: "Toda la información clara y bien organizada",
    description:
      "Ubicación, itinerario, vestimenta, mesa de regalos y más en un solo lugar.",
  },
  {
    icon: <CheckSquare className="w-8 h-8 text-primary-500" />,
    title: "Control de confirmación de asistencia",
    description:
      "En tiempo real y con estadísticas (sabrás quién va, quién no y quién falta por confirmar).",
  },
  {
    icon: <QrCode className="w-8 h-8 text-primary-500" />,
    title: "Pases digitales con código QR",
    description:
      "Y mesas asignadas para un control de acceso ordenado y profesional a tu evento.",
  },
  {
    icon: <ImageIcon className="w-8 h-8 text-primary-500" />,
    title: "Galería privada",
    description:
      "Código QR para compartir momentos capturados por tus invitados.",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-primary-50" id="caracteristicas">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            ¿Qué hace diferente a nuestras invitaciones digitales? 💡
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Todo lo que necesitas para organizar tu evento con estilo, control y
            tranquilidad, desde una sola invitación digital.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-primary-100"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            💬 Crear mi invitación
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
