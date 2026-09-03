import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getFilterDateStr, getTurnosFromFinalizacao, parseTimestamptzFull } from '../lib/dateUtils';
import { calcTempoMedio } from '../lib/inboundMetrics';

async function fetchInboundTrips(setTripsInbound, setLoading) {
  setLoading(true);
  const { data, error } = await supabase
    .from('inbound_trips')
    .select('*');

  if (!error && data) {
    setTripsInbound(data);
  } else {
    console.error('Erro ao carregar inbound_trips:', error);
    setTripsInbound([]);
  }
  setLoading(false);
}

// Hook responsável por buscar as viagens do relatório de recebimento e derivar
// todas as métricas (contagens e tempos médios) usadas no modal de Resumo Inbound.
export function useInboundReport(selectedTurnos, selectedDataFilter) {
  const [tripsInbound, setTripsInbound] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInboundTrips(setTripsInbound, setLoading);
    const interval = setInterval(() => fetchInboundTrips(setTripsInbound, setLoading), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Ordenação DECRESCENTE por hora_finalizacao (veículo com maior hora_finalizacao fica em primeiro lugar)
  const filteredFinalizedTrips = useMemo(() => {
    return tripsInbound
      .filter(trip => {
        if (trip.status !== 'Finalizado') return false;

        const refDateStr = trip.hora_finalizacao;
        if (!refDateStr) return false;

        if (selectedTurnos.length > 0) {
          const turnosCalculados = getTurnosFromFinalizacao(refDateStr);
          const atendeTurno = selectedTurnos.some(t => turnosCalculados.includes(t));
          if (!atendeTurno) return false;
        }

        const tripOpDate = trip.data_operacional;
        if (!tripOpDate) return false;

        if (selectedDataFilter === 'HOJE') {
          if (tripOpDate !== getFilterDateStr(0)) return false;
        } else if (selectedDataFilter === 'D-1') {
          if (tripOpDate !== getFilterDateStr(1)) return false;
        } else if (selectedDataFilter === 'D-2') {
          if (tripOpDate !== getFilterDateStr(2)) return false;
        } else if (selectedDataFilter === 'TODOS') {
          const janelaValida = [getFilterDateStr(0), getFilterDateStr(1), getFilterDateStr(2)];
          if (!janelaValida.includes(tripOpDate)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.hora_finalizacao ? (parseTimestamptzFull(a.hora_finalizacao)?.getTime() || 0) : 0;
        const timeB = b.hora_finalizacao ? (parseTimestamptzFull(b.hora_finalizacao)?.getTime() || 0) : 0;
        return timeB - timeA;
      });
  }, [tripsInbound, selectedTurnos, selectedDataFilter]);

  const totalCarrosRecebidos = filteredFinalizedTrips.length;
  const totalPacotesRecebidos = filteredFinalizedTrips.reduce((acc, t) => acc + (Number(t.total_packages) || 0), 0);

  const filteredTripsLH = useMemo(
    () => filteredFinalizedTrips.filter(t => (t.modality || 'LH') === 'LH'),
    [filteredFinalizedTrips]
  );
  const filteredTripsFM = useMemo(
    () => filteredFinalizedTrips.filter(t => (t.modality || 'LH') === 'FM'),
    [filteredFinalizedTrips]
  );

  const totalCarrosLH = filteredTripsLH.length;
  const totalCarrosFM = filteredTripsFM.length;
  const totalPacotesLH = filteredTripsLH.reduce((acc, t) => acc + (Number(t.total_packages) || 0), 0);
  const totalPacotesFM = filteredTripsFM.reduce((acc, t) => acc + (Number(t.total_packages) || 0), 0);

  const tempoFilaMedioStr = useMemo(() => calcTempoMedio(filteredFinalizedTrips, 'fila'), [filteredFinalizedTrips]);
  const tempoDescargaMedioStr = useMemo(() => calcTempoMedio(filteredFinalizedTrips, 'descarga'), [filteredFinalizedTrips]);
  const tempoPermanenciaMedioStr = useMemo(() => calcTempoMedio(filteredFinalizedTrips, 'permanencia'), [filteredFinalizedTrips]);

  const tempoFilaLHStr = useMemo(() => calcTempoMedio(filteredTripsLH, 'fila'), [filteredTripsLH]);
  const tempoFilaFMStr = useMemo(() => calcTempoMedio(filteredTripsFM, 'fila'), [filteredTripsFM]);
  const tempoDescargaLHStr = useMemo(() => calcTempoMedio(filteredTripsLH, 'descarga'), [filteredTripsLH]);
  const tempoDescargaFMStr = useMemo(() => calcTempoMedio(filteredTripsFM, 'descarga'), [filteredTripsFM]);
  const tempoPermanenciaLHStr = useMemo(() => calcTempoMedio(filteredTripsLH, 'permanencia'), [filteredTripsLH]);
  const tempoPermanenciaFMStr = useMemo(() => calcTempoMedio(filteredTripsFM, 'permanencia'), [filteredTripsFM]);

  const veiculosDescarregando = useMemo(() => {
    return tripsInbound.filter(trip => String(trip.status || '').trim().toLowerCase() === 'docado');
  }, [tripsInbound]);

  return {
    loading,
    tripsInbound,
    filteredFinalizedTrips,
    totalCarrosRecebidos,
    totalPacotesRecebidos,
    totalCarrosLH,
    totalCarrosFM,
    totalPacotesLH,
    totalPacotesFM,
    tempoFilaMedioStr,
    tempoDescargaMedioStr,
    tempoPermanenciaMedioStr,
    tempoFilaLHStr,
    tempoFilaFMStr,
    tempoDescargaLHStr,
    tempoDescargaFMStr,
    tempoPermanenciaLHStr,
    tempoPermanenciaFMStr,
    veiculosDescarregando
  };
}
