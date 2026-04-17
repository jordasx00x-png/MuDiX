import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sofia Cancino",
    time: "hace aproximadamente 2 días",
    text: "Los diseños que manejan, la calidad de el trabajo y la atención que te brindan es excelente. Me resolvieron todas mis dudas y quedé muy satisfecha con mi invitación.",
  },
  {
    name: "Sharon Pérez",
    time: "hace aproximadamente 3 días",
    text: "Excelente servicio, tienen diseños muy bonitos, opciones muy funcionales y se adecuan a la idea que uno quiera plasmar",
  },
  {
    name: "Adriana Vidal",
    time: "hace aproximadamente 3 días",
    text: "Los recomiendo ampliamente Me hicieron la invitación de los xv años de mi hijo la verdad quedó espectacular, me dieron excelente Servicio y la atención ya ni se diga y lo que más me gusto que te envían cómo va quedando su trabajo y puedes hacer modificaciones por si algo no te gusta.",
  },
  {
    name: "Andreina Vida Amor",
    time: "hace aproximadamente 3 días",
    text: "Me encanto su trabajo , muy profesionales. Superó mis expectativas. El mismo día me hicieron llegar la invitación de cumpleaños 🎂 temática halloween 🎃 con botones de invitación donde las personas indicaran si asistirán o no asistirán. Súper confiables 🙌 gracias 🙏",
  },
  {
    name: "Karen Ortiz",
    time: "hace aproximadamente 3 días",
    text: "la atención es muy buena, son muy específicos en cada uno de los detalles, 100% recomendado :)",
  },
  {
    name: "Grizelda Garza Obregon",
    time: "hace aproximadamente 4 días",
    text: "A Súper mega recomendable y 100% confiable. Te van explicando con súper atención y calma tus dudas y al final el trabajo es espléndido. Hay un acompañamiento todo el tiempo hasta el día de tu evento.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white" id="testimonios">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Testimonios de nuestros clientes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Agradecemos la confianza de todos nuestros clientes que han vivido
            la experiencia MuDiX. Algunas opiniones de nuestro trabajo.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
