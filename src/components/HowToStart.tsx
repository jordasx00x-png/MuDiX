import { motion } from "motion/react";
import { MessageCircle, FileText, Paintbrush, Share2 } from "lucide-react";

const steps = [
  {
    icon: <MessageCircle className="w-8 h-8 text-white" />,
    title: "Elige el estilo y contáctanos",
    description:
      "Revisa nuestras muestras, elige el estilo de invitación que más te guste y contáctanos por WhatsApp.",
  },
  {
    icon: <FileText className="w-8 h-8 text-white" />,
    title: "Llena el formulario",
    description:
      "Te enviaremos un formulario para que nos proporciones todos los datos de tu evento.",
  },
  {
    icon: <Paintbrush className="w-8 h-8 text-white" />,
    title: "Trabajamos en tu invitación",
    description:
      "Diseñamos y personalizamos tu invitación digital con la información proporcionada.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-white" />,
    title: "Comparte el enlace",
    description:
      "Recibe tu invitación lista y compártela con tus invitados para crear una experiencia inolvidable.",
  },
];

export default function HowToStart() {
  return (
    <section className="py-24 bg-white" id="como-empezar">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            ¿Cómo Empezar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Nuestro proceso es sencillo y rápido
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-primary-100 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30 border-4 border-white z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
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
          <a
            href="https://api.whatsapp.com/send?phone=526145463919&text=¡Hola! Quiero iniciar con el proceso de diseño de mi invitación digital para quince años"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Iniciar con el proceso
          </a>
        </motion.div>
      </div>
    </section>
  );
}
