import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { STATUS_PRIORITY } from '../constants';
import { formatTimestamp, formatMinutesToHHMM, getFilterDateStr, parseTimestamptzAsLocal, parseTimeToMinutes } from '../lib/dateUtils';

const fetchForecast = async (setForecastData) => {
  try {
    const { data, error } = await supabase
      .from('inbound_forecast')
      .select('forecast_lh, forecast_fm')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar Forecast:', error.message);
      return;
    }

    if (data) {
      setForecastData({
        forecast_lh: Number(data.forecast_lh) || 0,
        forecast_fm: Number(data.forecast_fm) || 0
      });
    }
  } catch (err) {
    console.error('Erro ao processar Forecast:', err.message);
  }
};

// Calcula "permanencia" em memória apenas para exibição, quando o registro ainda não tem
// esse valor salvo. Somente leitura: propositalmente NÃO grava nada de volta no Supabase.
const processTripTimestamps = (rawTrips) => {
  return rawTrips.map((trip) => {
    if (trip.hora_doca && trip.hora_finalizacao && !trip.permanencia) {
      const docaTime = parseTimestamptzAsLocal(trip.hora_doca)?.getTime();
      const finalTime = parseTimestamptzAsLocal(trip.hora_finalizacao)?.getTime();

      if (docaTime && finalTime) {
        const dischargeMinutes = Math.max(0, Math.floor((finalTime - docaTime) / (1000 * 60)));
        const waitMinutes = parseTimeToMinutes(trip.waiting_time);
        const totalPermanenciaMinutes = waitMinutes + dischargeMinutes;

        return { ...trip, permanencia: formatMinutesToHHMM(totalPermanenciaMinutes) };
      }
    }

    return trip;
  });
};

// Janela de busca (em dias) usada para achar o dia mais recente com dados, quando "hoje" vier vazio.
const FALLBACK_WINDOW_DAYS = 30;

// Busca, dentro da janela, o dia operacional mais recente que tenha viagens — somente leitura.
const fetchMostRecentDayWithData = async () => {
  const windowStart = getFilterDateStr(FALLBACK_WINDOW_DAYS);

  const { data, error } = await supabase
    .from('inbound_trips')
    .select('*')
    .gte('data_operacional', windowStart)
    .order('data_operacional', { ascending: false });

  if (error || !data || data.length === 0) return null;

  const mostRecentDate = data[0].data_operacional;
  return {
    date: mostRecentDate,
    trips: data.filter((trip) => trip.data_operacional === mostRecentDate)
  };
};

// Hook responsável por buscar, sincronizar (polling + realtime) e ordenar as viagens do dia
export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [forecastData, setForecastData] = useState({ forecast_lh: 0, forecast_fm: 0 });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState('');
  const [displayedDate, setDisplayedDate] = useState(getFilterDateStr(0));

  const fetchTrips = async () => {
    try {
      setLoading(true);
      await fetchForecast(setForecastData);

      const todayStr = getFilterDateStr(0);
      const { data, error } = await supabase
        .from('inbound_trips')
        .select('*')
        .eq('data_operacional', todayStr);

      if (error) throw error;

      let tripsData = data || [];
      let effectiveDate = todayStr;

      // Sem nada para hoje ainda: cai para o dia mais recente com dados (só leitura, não altera nada no banco).
      if (tripsData.length === 0) {
        const fallback = await fetchMostRecentDayWithData();
        if (fallback) {
          tripsData = fallback.trips;
          effectiveDate = fallback.date;
        }
      }

      setDisplayedDate(effectiveDate);

      tripsData = tripsData.map(item => ({
        ...item,
        status: item.status === 'Sendo docado' ? 'Atribuído' : item.status
      }));

      tripsData = processTripTimestamps(tripsData);

      const sortedData = tripsData.sort((a, b) => {
        const priorityA = STATUS_PRIORITY[a.status] || 99;
        const priorityB = STATUS_PRIORITY[b.status] || 99;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return (a.origin || '').localeCompare(b.origin || '', undefined, { numeric: true });
      });

      setTrips(sortedData);

      if (sortedData.length > 0) {
        const maxUpdatedAt = sortedData.reduce((max, trip) => {
          if (!trip.updated_at) return max;
          return !max || new Date(trip.updated_at) > new Date(max) ? trip.updated_at : max;
        }, null);

        if (maxUpdatedAt) {
          setLastSync(formatTimestamp(maxUpdatedAt));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar viagens:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();

    const interval = setInterval(() => {
      fetchTrips();
    }, 3 * 60 * 1000);

    const tripsChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inbound_trips' }, () => {
        fetchTrips();
      })
      .subscribe();

    const forecastChannel = supabase
      .channel('schema-forecast-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inbound_forecast' }, () => {
        fetchForecast(setForecastData);
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(tripsChannel);
      supabase.removeChannel(forecastChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFallbackDate = displayedDate !== getFilterDateStr(0);

  return { trips, forecastData, loading, lastSync, displayedDate, isFallbackDate, refetch: fetchTrips };
}
