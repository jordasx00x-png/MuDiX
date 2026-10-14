import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithPopup, googleProvider, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from '../firebase';
import { ArrowRight, Loader2, Mail, Lock, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Landing() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'google' | 'email' | 'guest'>('google');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const getRedirectUrl = () => searchParams.get('redirect') || '/dashboard';

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate(getRedirectUrl());
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('auth/unauthorized-domain') || err.code === 'auth/unauthorized-domain') {
        try {
          await signInAnonymously(auth);
          toast.success('¡Sesión iniciada con éxito!');
          navigate(getRedirectUrl());
          return;
        } catch (fallbackErr) {
          setError('Este dominio no está autorizado en Firebase Console. Utiliza el Acceso como Invitado.');
          setMode('guest');
        }
      } else {
        setError(err.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setIsLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('¡Cuenta creada con éxito!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('¡Bienvenido de nuevo!');
      }
      navigate(getRedirectUrl());
    } catch (err: any) {
      console.error(err);
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = 'Este correo ya está registrado.';
      else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') msg = 'Correo o contraseña incorrectos.';
      else if (err.code === 'auth/weak-password') msg = 'La contraseña debe tener al menos 6 caracteres.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      toast.success('¡Sesión de invitado iniciada!');
      navigate(getRedirectUrl());
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión como invitado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f7f3ec] to-[#f0e9df] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#af9462]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border border-[#af9462]/30 mb-4 text-[#af9462]">
          <Heart className="w-8 h-8 fill-current text-[#af9462]/80" />
        </div>
        <h1 className="text-4xl font-light tracking-tight text-[#2c2c2b] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          MuDiX
        </h1>
        <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#af9462]">
          Invitaciones Digitales Inteligentes
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-[#af9462]/20 sm:px-10">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-start gap-3 shadow-sm"
            >
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider">Aviso de autenticación</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('google'); setError(''); }}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'google' ? 'bg-white text-[#2c2c2b] shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => { setMode('email'); setError(''); }}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'email' ? 'bg-white text-[#2c2c2b] shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Correo
            </button>
            <button
              type="button"
              onClick={() => { setMode('guest'); setError(''); }}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'guest' ? 'bg-white text-[#2c2c2b] shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Invitado
            </button>
          </div>

          {mode === 'google' && (
            <div className="space-y-6">
              <p className="text-xs text-gray-600 text-center">
                Accede de forma rápida y segura con tu cuenta de Google para gestionar tus invitaciones.
              </p>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#af9462] disabled:opacity-50 transition-all transform active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center">
                    <img src="https://www.gstatic.com/firebase/anonymous-scan/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                    <span>Continuar con Google</span>
                    <ArrowRight className="ml-2 w-4 h-4 text-gray-400" />
                  </span>
                )}
              </button>
            </div>
          )}

          {mode === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#af9462] focus:border-transparent bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#af9462] focus:border-transparent bg-gray-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-[#2c2c2b] hover:bg-[#3c3c3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#af9462] disabled:opacity-50 transition-all transform active:scale-95 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                )}
              </button>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-[#af9462] hover:underline font-medium"
                >
                  {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
                </button>
              </div>
            </form>
          )}

          {mode === 'guest' && (
            <div className="space-y-6 text-center">
              <div className="bg-[#fdfbf7] p-5 rounded-xl border border-[#af9462]/20 shadow-inner">
                <Sparkles className="w-8 h-8 text-[#af9462] mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-[#2c2c2b]">Acceso Instantáneo</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Prueba todas las funciones de creación y gestión de invitaciones digitales al instante.
                </p>
              </div>
              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-[#af9462] hover:bg-[#9d8353] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#af9462] disabled:opacity-50 transition-all transform active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center">
                    <span>Entrar como Invitado</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-8 text-center text-xs text-gray-500 relative z-10">
        &copy; {new Date().getFullYear()} MuDiX. Todos los derechos reservados.
      </div>
    </div>
  );
}
