import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Notification as NotificationType } from '../constants';

export default function Notification({ notification }: { notification: NotificationType }) {
  const styles = {
    success: 'bg-emerald-950 border-emerald-500 text-emerald-200',
    warning: 'bg-amber-950 border-amber-500 text-amber-200',
    error: 'bg-rose-950 border-rose-500 text-rose-200',
    info: 'bg-indigo-950 border-indigo-500 text-indigo-200',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 ${styles[notification.type]}`}>
      {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
      {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400" />}
      {notification.type === 'error' && <XCircle className="h-5 w-5 text-rose-400" />}
      {notification.type === 'info' && <Info className="h-5 w-5 text-indigo-400" />}
      <span className="text-sm font-medium">{notification.message}</span>
    </div>
  );
}
