import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

const links = [
  { name: "Muestras", href: "#muestras" },
  { name: "Características", href: "#caracteristicas" },
  { name: "Testimonios", href: "#testimonios" },
  { name: "FAQ", href: "#faq" },
  { name: "Cómo Empezar", href: "#como-empezar" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold font-serif text-primary-600">
          MuDiX
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden lg:inline-block">{user.name}</span>
              </div>
              <Link
                to="/dashboard"
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
              >
                Mis Invitaciones
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {user ? (
            <>
              <div className="flex items-center gap-3 py-2 border-b border-gray-100 mb-2">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="px-6 py-3 text-center font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mis Invitaciones
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 text-center font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-6 py-3 text-center font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors shadow-sm"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
