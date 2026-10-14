import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Cake, Baby, GraduationCap, Church, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';

const categories = [
  {
    id: 'wedding',
    name: 'Bodas',
    description: 'Invitaciones elegantes y románticas para el día más especial de sus vidas.',
    icon: <Heart className="w-8 h-8 text-rose-500 fill-current" />,
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    borderColor: 'border-rose-200 hover:border-rose-400',
    theme: 'boda_clasica',
    title: 'Nuestra Boda',
    defaultName: 'Ana & Carlos',
    tag: 'Más popular'
  },
  {
    id: 'quinceanera',
    name: 'XV Años',
    description: 'Diseños mágicos, brillantes y encantadores para celebrar una etapa inolvidable.',
    icon: <Star className="w-8 h-8 text-purple-500 fill-current" />,
    gradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
    borderColor: 'border-purple-200 hover:border-purple-400',
    theme: 'bosque',
    title: 'Mis XV Años',
    defaultName: 'Alejandra',
    tag: 'Elegante'
  },
  {
    id: 'birthday',
    name: 'Cumpleaños',
    description: 'Diversión, color y energía para festejar un año más de vida a lo grande.',
    icon: <Cake className="w-8 h-8 text-blue-500" />,
    gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
    borderColor: 'border-blue-200 hover:border-blue-400',
    theme: 'cumpleanos_infantil',
    title: '¡Mi Cumpleaños!',
    defaultName: 'Mateo',
    tag: 'Divertido'
  },
  {
    id: 'kids_birthday',
    name: 'Cumpleaños Infantiles',
    description: 'Temáticas mágicas con superhéroes y personajes favoritos para los pequeños.',
    icon: <Baby className="w-8 h-8 text-orange-500" />,
    gradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    borderColor: 'border-orange-200 hover:border-orange-400',
    theme: 'superheroe',
    title: '¡Mi Súper Fiesta!',
    defaultName: 'Mateo',
    tag: 'Infantil'
  },
  {
    id: 'baby_shower',
    name: 'Baby Shower',
    description: 'Tiernas invitaciones con tonos pastel para dar la bienvenida al nuevo integrante.',
    icon: <Baby className="w-8 h-8 text-teal-500" />,
    gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    borderColor: 'border-teal-200 hover:border-teal-400',
    theme: 'baby_shower',
    title: 'Baby Shower',
    defaultName: 'Bebé en camino',
    tag: 'Tierno'
  },
  {
    id: 'graduation',
    name: 'Graduación',
    description: 'Celebra el éxito, el esfuerzo y la culminación de una gran meta académica.',
    icon: <GraduationCap className="w-8 h-8 text-slate-700" />,
    gradient: 'from-slate-500/10 via-gray-500/5 to-transparent',
    borderColor: 'border-slate-200 hover:border-slate-400',
    theme: 'graduacion',
    title: 'Mi Graduación',
    defaultName: 'Generación 2024',
    tag: 'Académico'
  },
  {
    id: 'baptism',
    name: 'Bautizo',
    description: 'Diseños delicados, limpios y espirituales para esta sagrada ceremonia.',
    icon: <Church className="w-8 h-8 text-sky-500" />,
    gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    borderColor: 'border-sky-200 hover:border-sky-400',
    theme: 'bautizo',
    title: 'Mi Bautizo',
    defaultName: 'Sofía',
    tag: 'Religioso'
  },
  {
    id: 'anniversary',
    name: 'Aniversario',
    description: 'Festeja los años de amor incondicional y compromiso compartido.',
    icon: <Calendar className="w-8 h-8 text-amber-500" />,
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    borderColor: 'border-amber-200 hover:border-amber-400',
    theme: 'aniversario',
    title: 'Aniversario',
    defaultName: 'Laura & Jorge',
    tag: 'Romántico'
  }
];

export default function TemplateSelector() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <Navbar />
      <div className="pt-28 pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#af9462]/10 text-[#af9462] text-xs font-serif uppercase tracking-[0.25em] mb-4">
              <Sparkles className="w-4 h-4" /> Plantillas Profesionales
            </div>
            <h1 className="text-4xl sm:text-5xl font-light text-[#2c2c2b] mb-4 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Elige el tipo de evento
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Selecciona una categoría para comenzar con una plantilla diseñada a medida, totalmente personalizable e interactiva.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  to={`/editor?template=${category.id}`}
                  className={`group relative flex flex-col h-full p-8 rounded-3xl border-2 bg-white/80 backdrop-blur-xl ${category.borderColor} shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden`}
                >
                  {/* Subtle Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="p-4 bg-white shadow-md rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    {category.tag && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#af9462] bg-[#af9462]/10 px-3 py-1 rounded-full shadow-sm">
                        {category.tag}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-[#2c2c2b] mb-2 group-hover:text-[#af9462] transition-colors relative z-10" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {category.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-8 flex-1 leading-relaxed relative z-10">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-2 text-[#2c2c2b] font-medium group-hover:text-[#af9462] group-hover:gap-3 transition-all relative z-10 pt-4 border-t border-gray-100">
                    <span>Personalizar Plantilla</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
