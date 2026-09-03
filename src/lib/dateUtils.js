// Auxiliar para converter HH:MM ou HH:MM:SS em minutos
export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
};

// Auxiliar para converter minutos em HH:MM
export const formatMinutesToHHMM = (totalMinutes) => {
  if (isNaN(totalMinutes) || totalMinutes < 0) return '00:00';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Força o parse a ler a hora literal salva na string, sem converter fuso
export const parseTimestamptzAsLocal = (tsStr) => {
  if (!tsStr) return null;
  // Se for no formato ISO (ex: 2026-08-27 11:41:37.635955+00 ou 11:41:37)
  if (typeof tsStr === 'string' && tsStr.includes(':')) {
    const timeMatch = tsStr.match(/(\d{2}):(\d{2}):?(\d{2})?/);
    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch;
      const d = new Date();
      d.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds || 0, 10), 0);
      return d;
    }
  }
  const d = new Date(tsStr);
  return isNaN(d.getTime()) ? null : d;
};

// Igual ao parse acima, mas preserva a data literal (ano/mês/dia) da string, sem converter fuso.
// Necessário para ordenação cronológica real entre dias diferentes (ex: madrugada vs noite anterior).
export const parseTimestamptzFull = (tsStr) => {
  if (!tsStr) return null;
  if (typeof tsStr === 'string') {
    const match = tsStr.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):?(\d{2})?/);
    if (match) {
      const [, year, month, day, hours, minutes, seconds] = match;
      return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hours, 10),
        parseInt(minutes, 10),
        parseInt(seconds || 0, 10)
      );
    }
  }
  const d = new Date(tsStr);
  return isNaN(d.getTime()) ? null : d;
};

// Formata exibindo as horas exatamente como estão salvas
export const formatTimestamptzToTime = (tsStr) => {
  if (!tsStr) return '-';
  if (typeof tsStr === 'string') {
    const match = tsStr.match(/(\d{2}):(\d{2})/);
    if (match) return `${match[1]}:${match[2]}`;
  }
  const d = parseTimestamptzAsLocal(tsStr);
  if (!d) return '-';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Função para calcular o Tempo de Descarga em minutos a partir de duas datas/timestamps
export const getDischargeMinutes = (horaDoca, horaFinalizacao) => {
  if (!horaDoca || !horaFinalizacao) return 0;
  const docaTime = parseTimestamptzAsLocal(horaDoca)?.getTime();
  const finalTime = parseTimestamptzAsLocal(horaFinalizacao)?.getTime();
  if (!docaTime || !finalTime || finalTime < docaTime) return 0;
  return Math.floor((finalTime - docaTime) / (1000 * 60));
};

// Função para calcular o Tempo de Descarga (hora_finalizacao - hora_doca) formatado HH:MM
export const getDischargeTime = (horaDoca, horaFinalizacao) => {
  if (!horaDoca || !horaFinalizacao) return '-';
  const minutes = getDischargeMinutes(horaDoca, horaFinalizacao);
  return formatMinutesToHHMM(minutes);
};

// Formata uma data operacional "YYYY-MM-DD" como "DD/MM" para exibição compacta
export const formatOperationalDateLabel = (dateStr) => {
  if (!dateStr) return '';
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
};

export const getFilterDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
};

export const getDataOperacao = (tsStr) => {
  const d = parseTimestamptzAsLocal(tsStr);
  if (!d) return null;
  return d.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
};

// Lógica de Turnos considerando fuso horário de São Paulo (T1, T2, T3, T4)
export const getTurnosFromFinalizacao = (tsStr) => {
  const d = parseTimestamptzAsLocal(tsStr);
  if (!d) return [];

  const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' });
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);

  const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
  const turnos = [];

  // T1 -> 06:00:00 às 13:59:59
  if (timeInSeconds >= 6 * 3600 && timeInSeconds < 14 * 3600) {
    turnos.push('T1');
  }
  // T2 -> 14:00:00 às 21:59:59
  if (timeInSeconds >= 14 * 3600 && timeInSeconds < 22 * 3600) {
    turnos.push('T2');
  }
  // T3 -> 22:00:00 às 05:59:59
  if (timeInSeconds >= 22 * 3600 || timeInSeconds < 6 * 3600) {
    turnos.push('T3');
  }
  // T4 -> 17:00:00 às 01:59:59 (Sobreposição com T2 e T3)
  if (timeInSeconds >= 17 * 3600 || timeInSeconds < 2 * 3600) {
    turnos.push('T4');
  }

  return turnos;
};

// Formata um timestamp completo (ISO) para exibição relativa ao dia atual em America/Sao_Paulo
export const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);

  // Comparação do dia atual levando em conta America/Sao_Paulo
  const todayStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const dateStr = date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const isToday = todayStr === dateStr;
  if (isToday) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo' });
  }
  return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}`;
};
