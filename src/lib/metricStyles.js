import { parseTimeToMinutes } from './dateUtils';

// Lógica unificada de cores para Fila, Descarga e Permanência
export const getMetricColor = (type, timeStr, darkMode) => {
  if (!timeStr || timeStr === '-') return darkMode ? 'text-slate-100' : 'text-slate-800';
  const minutes = parseTimeToMinutes(timeStr);

  if (type === 'fila' || type === 'descarga') {
    if (minutes < 30) return darkMode ? 'text-emerald-400' : 'text-emerald-600';
    if (minutes < 60) return darkMode ? 'text-amber-400 font-bold' : 'text-amber-500 font-bold';
    return darkMode ? 'text-red-400 font-black animate-pulse' : 'text-red-600 font-black';
  } else if (type === 'permanencia') {
    if (minutes < 60) return darkMode ? 'text-emerald-400' : 'text-emerald-600';
    if (minutes < 120) return darkMode ? 'text-amber-400 font-bold' : 'text-amber-500 font-bold';
    return darkMode ? 'text-red-400 font-black animate-pulse' : 'text-red-600 font-black';
  }

  return darkMode ? 'text-slate-100' : 'text-slate-800';
};

export const getPermanenceStatus = (permanenciaStr) => {
  const minutes = parseTimeToMinutes(permanenciaStr);
  if (minutes < 60) return 'green';
  if (minutes < 120) return 'yellow';
  return 'red';
};

export const getPermanenceTextColor = (permanenceStatus, darkMode) => {
  switch (permanenceStatus) {
    case 'yellow':
      return darkMode ? 'text-amber-400 font-bold' : 'text-amber-500 font-bold';
    case 'red':
      return darkMode ? 'text-red-400 font-black animate-pulse' : 'text-red-600 font-black';
    case 'green':
    default:
      return darkMode ? 'text-emerald-400' : 'text-emerald-600';
  }
};

export const formatNumber = (num) => (Number(num) || 0).toLocaleString('pt-BR');
