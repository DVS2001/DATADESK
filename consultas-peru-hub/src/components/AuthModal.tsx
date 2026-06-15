import React, { useState } from 'react';
import { UserSession } from '../types';
import { User, LogIn, Mail, ChevronRight, Check } from 'lucide-react';

interface AuthModalProps {
  currentUser: UserSession | null;
  onLogin: (session: UserSession) => void;
  onLogout: () => void;
  language: 'es' | 'en';
}

export default function AuthModal({ currentUser, onLogin, onLogout, language }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMess, setErrorMess] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    es: {
      login: "Iniciar Sesión",
      signup: "Registrarse",
      emailPlh: "Tu correo electrónico",
      namePlh: "Tu nombre completo",
      logout: "Cerrar Sesión",
      welcome: "Hola,",
      desc: "Regístrate para habilitar sincronización en tiempo real y respaldar tu historial.",
      orLogin: "O inicia sesión con un correo existente",
      orRegister: "¿No tienes una cuenta? Regístrate aquí",
      submit: "Continuar",
      errorEmail: "Por favor introduce un correo válido."
    },
    en: {
      login: "Sign In",
      signup: "Register Account",
      emailPlh: "Your email address",
      namePlh: "Your full name",
      logout: "Log Out",
      welcome: "Welcome,",
      desc: "Register to unlock real-time cloud synchronization and backup search logs.",
      orLogin: "Or sign in with an existing email",
      orRegister: "Don't have an account? Sign up here",
      submit: "Continue",
      errorEmail: "Please provide a valid email."
    }
  }[language];

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');

    if (!validateEmail(email)) {
      setErrorMess(t.errorEmail);
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        // Register route
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: name || email.split('@')[0] })
        });
        const result = await response.json();
        
        if (result.success) {
          onLogin({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            createdAt: result.user.createdAt
          });
        } else {
          setErrorMess(result.message);
        }
      } else {
        // Login route
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const result = await response.json();
        
        if (result.success) {
          onLogin({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            createdAt: result.user.createdAt
          });
        } else {
          setErrorMess(result.message);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMess("Error de conexión. Iniciando sesión localmente.");
      // Fallback local session if connection error
      onLogin({
        id: `local-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-2 pl-3.5 pr-3.5 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold rounded-full flex items-center justify-center text-xs">
            {currentUser.name[0].toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{t.welcome}</p>
            <p className="text-xs font-bold text-zinc-855 dark:text-zinc-100">{currentUser.name}</p>
          </div>
        </div>
        <button
          id="btn-auth-logout"
          onClick={onLogout}
          className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 rounded transition-colors border border-red-100 dark:border-red-900/30 cursor-pointer"
        >
          {t.logout}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 max-w-sm w-full font-sans shadow-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <LogIn className="w-4 h-4 text-blue-500" />
        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
          {isRegistering ? t.signup : t.login}
        </h5>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4 font-medium leading-relaxed">
        {t.desc}
      </p>

      <form onSubmit={handleAuth} className="space-y-3">
        {isRegistering && (
          <div className="relative">
            <input
              id="auth-signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlh}
              required
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
          </div>
        )}
        <div className="relative">
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlh}
            required
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
        </div>

        {errorMess && (
          <p className="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
            ⚠️ {errorMess}
          </p>
        )}

        <button
          id="btn-auth-submit"
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
        >
          <span>{loading ? '...' : t.submit}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <button
        id="btn-auth-toggle-mode"
        onClick={() => {
          setIsRegistering(!isRegistering);
          setErrorMess('');
        }}
        className="w-full mt-3.5 text-[10px] text-center text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 font-semibold cursor-pointer underline decoration-dotted block"
      >
        {isRegistering ? t.orLogin : t.orRegister}
      </button>
    </div>
  );
}
