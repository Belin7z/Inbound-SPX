import { formatNumber, getMetricColor } from '../../lib/metricStyles';
import { formatTimestamptzToTime } from '../../lib/dateUtils';
import { getPermanenciaTotal } from '../../lib/inboundMetrics';

const GRID_COLUMNS = { gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.3fr 1fr' };

export default function VehiclesTable({
  darkMode,
  loading,
  filteredFinalizedTrips,
  totalCarrosRecebidos,
  selectedTrip,
  onSelectTrip,
  height
}) {
  return (
    <section
      className={`border rounded-lg overflow-hidden text-xs shadow-sm min-w-0 flex flex-col ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}
      style={height ? { height: `${height}px` } : undefined}
    >
      {/* CABEÇALHO LARANJA UNIFICADO */}
      <div className="bg-orange-500 text-white py-2 px-3 font-black font-sans uppercase text-[11px] tracking-wider flex justify-between items-center h-[36px]">
        <div className="text-left font-black tracking-wider">
          VEÍCULOS RECEBIDOS
        </div>
        <div className="text-right font-mono text-[11px]">
          {formatNumber(totalCarrosRecebidos)} VEÍCULOS
        </div>
      </div>

      <div className="w-full font-mono text-sm flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={`grid w-full uppercase font-bold border-b py-2 px-1.5 items-center text-xs ${
          darkMode ? 'bg-slate-900/95 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`} style={GRID_COLUMNS}>
          <div className="min-w-0 text-center px-1 truncate">HORA FINALIZAÇÃO</div>
          <div className="min-w-0 text-center px-1 truncate">LT</div>
          <div className="min-w-0 text-center px-1 truncate">Nº FILA</div>
          <div className="min-w-0 text-center px-1 truncate">MODALIDADE</div>
          <div className="min-w-0 text-center px-1 truncate">PACOTES RECEBIDOS</div>
          <div className="min-w-0 text-center px-1 truncate">PERMANÊNCIA</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {loading ? (
            <div className="py-8 text-center text-slate-400">Carregando dados de recebimento...</div>
          ) : filteredFinalizedTrips.length === 0 ? (
            <div className="py-8 text-center text-slate-400">Nenhum veículo recebido encontrado para os filtros selecionados.</div>
          ) : (
            filteredFinalizedTrips.map((trip) => {
              const isSelected = selectedTrip?.id === trip.id;
              const permTotal = getPermanenciaTotal(trip);

              return (
                <div
                  key={trip.id}
                  onClick={() => onSelectTrip(isSelected ? null : trip)}
                  className={`grid w-full ${filteredFinalizedTrips.length > 15 ? 'py-1.5' : 'py-2'} px-1.5 cursor-pointer transition-colors items-center text-sm ${
                    isSelected
                      ? darkMode
                        ? 'bg-slate-700/80 font-bold'
                        : 'bg-orange-50 font-bold'
                      : darkMode
                      ? 'hover:bg-slate-700/40 font-semibold'
                      : 'hover:bg-slate-50 font-semibold'
                  }`} style={GRID_COLUMNS}
                >
                  <div className="min-w-0 text-center px-0.5 font-bold">
                    {formatTimestamptzToTime(trip.hora_finalizacao)}
                  </div>
                  <div className="min-w-0 text-center text-orange-500 font-bold truncate px-0.5" title={trip.lt_number || '-'}>
                    {trip.lt_number || '-'}
                  </div>
                  <div className="min-w-0 text-center truncate px-0.5" title={trip.origin || '-'}>
                    {trip.origin || '-'}
                  </div>
                  <div className="min-w-0 text-center px-0.5 font-bold">
                    {trip.modality || 'LH'}
                  </div>
                  <div className="min-w-0 text-center px-0.5">
                    {formatNumber(trip.total_packages)}
                  </div>
                  <div className={`min-w-0 text-center font-bold px-0.5 ${getMetricColor('permanencia', permTotal, darkMode)}`}>
                    {permTotal}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
