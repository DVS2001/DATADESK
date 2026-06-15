import React, { useState } from 'react';
import { RealTimeNotification } from '../types';
import { Bell, BellRing, Sparkles, Shield, RefreshCw } from 'lucide-react';

interface NotificationCenterProps {
  notifications: RealTimeNotification[];
  language: 'es' | 'en';
  onClear: () => void;
}

export default function NotificationCenter({ notifications, language, onClear }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.length;

  const t = {
    es: {
      lblTitle: "Notificaciones del Sistema",
      lblClear: "Limpiar",
      lblEmpty: "No hay alertas recientes",
      lblSubtitle: "Notificaciones de contingencia SUNAT y CPE en tiempo real"
    },
    en: {
      lblTitle: "System Notifications",
      lblClear: "Clear",
      lblEmpty: "No recent notifications",
      lblSubtitle: "Real-time SUNAT and CPE contingency alerts"
    }
  }[language];

  return (
    <div className="relative">
      <button
        id="notification-hub-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer focus:outline-none"
        title="Notifications"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white dark:border-zinc-900 leading-none">
              {unreadCount}
            </span>
          </>
        ) : (
          <Bell className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-45" onClick={() => setIsOpen(false)}></div>
          
          {/* Menu Dropdown */}
          <div className="absolute right-0 mt-2.5 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-100 tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  {t.lblTitle}
                </h5>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 block">{t.lblSubtitle}</span>
              </div>
              {unreadCount > 0 && (
                <button
                  id="clear-notifications"
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                >
                  {t.lblClear}
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-500">
                  <Bell className="w-6 h-6 mx-auto mb-2 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-xs">{t.lblEmpty}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      {notif.type === 'success' ? (
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      ) : notif.type === 'warning' ? (
                        <BellRing className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {notif.message}
                      </p>
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block pt-1">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
