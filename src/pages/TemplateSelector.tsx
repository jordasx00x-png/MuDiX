import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Cake, Baby, GraduationCap, Church, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';

const categories = [
  {
    id: 'wedding',
    name: 'Bodas',
    description: 'Invitaciones elegantes y románticas para el día más especial.',
    icon: <Heart className="w-8 h-8 text-rose-500" />,
    color: 'bg-rose-50',
    borderColor: 'border-rose-200',
    hoverColor: 'hover:bg-rose-100',
    theme: 'boda_clasica',
    title: 'Nuestra Boda',
    defaultName: 'Ana & Carlos'
  },
  {
    id: 'quinceanera',
    name: 'XV Años',
    description: 'Diseños mágicos para celebrar una etapa inolvidable.',
    icon: <Star className="w-8 h-8 text-purple-500" />,
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:bg-purple-100',
    theme: 'bosque',
    title: 'Mis XV Años',
    defaultName: 'Alejandra'
  },
  {
    id: 'birthday',
    name: 'Cumpleaños',
    description: 'Diversión y color para festejar un año más de vida.',
    icon: <Cake className="w-8 h-8 text-blue-500" />,
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:bg-blue-100',
    theme: 'cumpleanos_infantil',
    title: '¡Mi Cumpleaños!',
    defaultName: 'Mateo'
  },
  {
    id: 'kids_birthday',
    name: 'Cumpleaños Infantiles',
    description: 'Invitaciones mágicas y divertidas con sus personajes favoritos.',
    icon: <Baby className="w-8 h-8 text-orange-500" />,
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
    hoverColor: 'hover:bg-orange-100',
    theme: 'superheroe',
    title: '¡Mi Súper Fiesta!',
    defaultName: 'Mateo'
  },
  {
    id: 'baby_shower',
    name: 'Baby Shower',
    description: 'Tiernas invitaciones para dar la bienvenida al nuevo integrante.',
    icon: <Baby className="w-8 h-8 text-teal-500" />,
    color: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:bg-teal-100',
    theme: 'baby_shower',
    title: 'Baby Shower',
    defaultName: 'Bebé en camino'
  },
  {
    id: 'graduation',
    name: 'Graduación',
    description: 'Celebra el éxito y el esfuerzo de alcanzar una meta.',
    icon: <GraduationCap className="w-8 h-8 text-slate-700" />,
    color: 'bg-slate-50',
    borderColor: 'border-slate-200',
    hoverColor: 'hover:bg-slate-100',
    theme: 'graduacion',
    title: 'Mi Graduación',
    defaultName: 'Generación 2024'
  },
  {
    id: 'baptism',
    name: 'Bautizo',
    description: 'Diseños delicados para una ceremonia espiritual.',
    icon: <Church className="w-8 h-8 text-sky-500" />,
    color: 'bg-sky-50',
    borderColor: 'border-sky-200',
    hoverColor: 'hover:bg-sky-100',
    theme: 'bautizo',
    title: 'Mi Bautizo',
    defaultName: 'Sofía'
  },
  {
    id: 'anniversary',
    name: 'Aniversario',
    description: 'Festeja los años de amor y compromiso compartido.',
    icon: <Calendar className="w-8 h-8 text-amber-500" />,
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    hoverColor: 'hover:bg-amber-100',
    theme: 'aniversario',
    title: 'Aniversario',
    defaultName: 'Laura & Jorge'
  }
];

export default function TemplateSelector() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Elige el tipo de evento</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecciona una categoría para comenzar con una plantilla diseñada especialmente para tu celebración.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/editor?template=${category.id}`}
                  className={`group flex flex-col h-full p-8 rounded-3xl border-2 ${category.borderColor} ${category.color} ${category.hoverColor} transition-all hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm w-fit group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
                  <p className="text-gray-600 mb-8 flex-1">{category.description}</p>
                  <div className="flex items-center gap-2 text-gray-900 font-bold group-hover:gap-4 transition-all">
                    <span>Empezar</span>
                    <ArrowRight className="w-5 h-5" />
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
