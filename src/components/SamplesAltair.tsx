import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

const samples = [
  {
    title: "Boda Clásica",
    image: "https://picsum.photos/seed/boda_clasica/600/800",
    link: "#",
  },
  {
    title: "Boda Rústica",
    image: "https://picsum.photos/seed/boda_rustica/600/800",
    link: "#",
  },
  {
    title: "Cumpleaños Infantil",
    image: "https://picsum.photos/seed/cumpleanos_infantil/600/800",
    link: "#",
  },
  {
    title: "Baby Shower",
    image: "https://picsum.photos/seed/baby_shower/600/800",
    link: "#",
  },
  {
    title: "Graduación",
    image: "https://picsum.photos/seed/graduacion/600/800",
    link: "#",
  },
  {
    title: "Bautizo",
    image: "https://picsum.photos/seed/bautizo/600/800",
    link: "#",
  },
  {
    title: "Aniversario",
    image: "https://picsum.photos/seed/aniversario/600/800",
    link: "#",
  },
  {
    title: "Bosque Encantado",
    image: "https://picsum.photos/seed/bosque/600/800",
    link: "#",
  },
  {
    title: "Bridgerton",
    image: "https://picsum.photos/seed/bridgerton/600/800",
    link: "#",
  },
  {
    title: "Elegancia Celestial",
    image: "https://picsum.photos/seed/elegancia/600/800",
    link: "#",
  },
];

export default function SamplesAltair() {
  return (
    <section className="py-24 bg-white" id="muestras">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Muestras para todo tipo de eventos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Las hacemos a tu gusto (música, colores, tipografías y temática a tu
            gusto sin costo extra), aquí van algunos ejemplos de
            personalización para bodas, XV años, cumpleaños y más.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {samples.map((sample, index) => (
            <motion.div
              key={sample.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={sample.image}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-2">
                  {sample.title}
                </h3>
                <a
                  href={sample.link}
                  className="inline-flex items-center text-primary-300 hover:text-white transition-colors"
                >
                  Ver invitación <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm group-hover:translate-y-full transition-transform duration-300">
                <h3 className="text-gray-900 font-medium text-center">
                  {sample.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
