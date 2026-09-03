import { parseTimeToMinutes, formatMinutesToHHMM, getDischargeMinutes } from './dateUtils';

export const getSacas = (trip) => Number(trip.volume_saca) || 0;
export const getScuttles = (trip) => Number(trip.volume_scuttle) || 0;
export const getPallets = (trip) => Number(trip.volume_pallet) || 0;
export const getTotalTOs = (trip) => getSacas(trip) + getScuttles(trip) + getPallets(trip);

export const getPermanenciaTotal = (trip) => {
  if (trip.permanencia) return trip.permanencia;
  const waitMin = parseTimeToMinutes(trip.waiting_time);
  const descMin = getDischargeMinutes(trip.hora_doca, trip.hora_finalizacao);
  return formatMinutesToHHMM(waitMin + descMin);
};

export const calcTempoMedio = (trips, tipo) => {
  if (trips.length === 0) return '00:00';

  if (tipo === 'fila') {
    const total = trips.reduce((acc, t) => acc + parseTimeToMinutes(t.waiting_time), 0);
    return formatMinutesToHHMM(Math.round(total / trips.length));
  }
  if (tipo === 'descarga') {
    const total = trips.reduce((acc, t) => acc + getDischargeMinutes(t.hora_doca, t.hora_finalizacao), 0);
    return formatMinutesToHHMM(Math.round(total / trips.length));
  }
  if (tipo === 'permanencia') {
    const total = trips.reduce((acc, t) => {
      if (t.permanencia) return acc + parseTimeToMinutes(t.permanencia);
      const waitMin = parseTimeToMinutes(t.waiting_time);
      const descMin = getDischargeMinutes(t.hora_doca, t.hora_finalizacao);
      return acc + waitMin + descMin;
    }, 0);
    return formatMinutesToHHMM(Math.round(total / trips.length));
  }
  return '00:00';
};
