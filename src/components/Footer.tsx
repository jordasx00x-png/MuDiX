import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 font-serif">MuDiX</h2>
        <p className="text-gray-400 mb-8 flex items-center justify-center">
          Somos apasionados en lo que hacemos{" "}
          <Heart className="w-4 h-4 text-primary-500 ml-2 fill-current" />
        </p>
        <div className="border-t border-gray-800 pt-8 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MuDiX. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
