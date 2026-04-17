import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Cuánto tiempo tarda en estar lista la invitación?",
    answer:
      "Una vez que tengamos toda la información y fotos necesarias, tu invitación estará lista en un promedio de 3 a 5 días hábiles. Si la necesitas antes, puedes consultarnos por opciones exprés.",
  },
  {
    question: "¿Cómo se personaliza la invitación?",
    answer:
      "Puedes elegir los colores, tipografías, fondo, agregar fotos, canción favorita y secciones como ubicación, padrinos, itinerario, código de vestimenta, mensaje de bienvenida y más. Nos adaptamos a la temática que tú elijas.",
  },
  {
    question: "¿Cómo se envía la invitación a los invitados?",
    answer:
      "Se comparte un link por WhatsApp, Facebook, Instagram o correo electrónico. Tus invitados podrán verla desde cualquier celular o computadora.",
  },
  {
    question: "¿Cómo funciona la confirmación de asistencia?",
    answer:
      "Incluimos un formulario dentro de la invitación. Cuando los invitados confirmen su asistencia, tú puedes ver sus respuestas desde nuestra plataforma en tiempo real, y saber cuántas personas asistirán. También contamos con la opción de que tus invitados te confirmen su asistencia a través de WhatsApp.",
  },
  {
    question: "¿Puedo hacer cambios después de entregada la invitación?",
    answer:
      "Sí, puedes hacer ajustes como corrección de texto, cambio de horario o datos del evento. Los cambios mayores después de aprobada la invitación pueden tener un costo adicional.",
  },
  {
    question: "¿Puedo elegir la canción de mi preferencia?",
    answer:
      "Sí. Puedes seleccionar la canción que más te guste para tu invitación digital.",
  },
  {
    question:
      "¿Cómo se personalizan con el nombre y número de personas las invitaciones?",
    answer:
      "Te damos acceso a nuestra plataforma, en donde capturas el nombre del invitado(a) y el número máximo de personas que puede llevar. De esta manera, cada invitado recibe un acceso único y personalizado, lo que facilita el control de asistencia y hace que la invitación sea más especial. No es necesario que nos envíes una lista de invitados.",
  },
  {
    question: "¿Puedo llevar un control de confirmación de asistencia?",
    answer:
      "Sí. Nuestra plataforma incluye un sistema para gestionar y controlar la asistencia de tus invitados en tiempo real. Podrás ver quién confirmó, quién rechazó y quién aún no ha respondido, facilitando la organización de tu evento.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-primary-50" id="faq">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Preguntas Frecuentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Resolvemos las dudas más comunes sobre nuestras invitaciones
            digitales personalizadas
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-left"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-primary-500 transition-transform duration-300 shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-white/50 rounded-b-2xl mt-1 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Tienes más preguntas?
          </h3>
          <a
            href="https://api.whatsapp.com/send?phone=526145463919&text=¡Hola! Tengo algunas preguntas sobre sus invitaciones digitales para quince años"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-600 bg-white border-2 border-primary-600 rounded-full hover:bg-primary-50 transition-colors shadow-sm hover:shadow-md"
          >
            Hacer una pregunta
          </a>
        </motion.div>
      </div>
    </section>
  );
}
