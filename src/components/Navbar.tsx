import { useState } from "react";
import { LogOut, User, Plus, Sparkles, LayoutGrid, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-8">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 text-2xl font-serif font-bold text-gray-900 tracking-tight group">
            <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200/60 flex items-center justify-center text-pink-600 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-current text-pink-500" />
            </div>
            <span className="font-serif">MuDiX</span>
          </Link>

          {/* Navigation Links (Zone 2) */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isCurrent("/dashboard")
                    ? "bg-gray-100/80 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-gray-500" />
                <span>Mis Invitaciones</span>
              </Link>
              <Link
                to="/select-template"
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isCurrent("/select-template")
                    ? "bg-gray-100/80 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Plantillas</span>
              </Link>
            </nav>
          )}
        </div>

        {/* User / Actions Zone (Zone 3) */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to="/select-template"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition-all shadow-sm hover:shadow active:scale-98 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Invitación</span>
              </Link>

              <div className="h-6 w-px bg-gray-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 pl-1">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || "Usuario"}
                      className="w-9 h-9 rounded-full ring-2 ring-gray-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm flex items-center justify-center ring-2 ring-pink-50">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-gray-900 leading-tight truncate max-w-[140px]">
                      {user.name || user.email?.split("@")[0] || "Invitado"}
                    </span>
                    <span className="text-[11px] text-gray-500 leading-tight">
                      {user.isAnonymous ? "Cuenta Demo" : "Activo"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
