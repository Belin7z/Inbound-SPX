import { formatNumber, getMetricColor } from '../../lib/metricStyles';
import { formatTimestamptzToTime, getDischargeTime } from '../../lib/dateUtils';
import { getTotalTOs, getPermanenciaTotal } from '../../lib/inboundMetrics';

function InfoCell({ darkMode, label, value, valueClassName }) {
  return (
    <div className={`p-1.5 rounded border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`text-[10px] uppercase font-sans font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{label}</div>
      <div className={`font-bold text-xs ${valueClassName || (darkMode ? 'text-slate-100' : 'text-slate-800')}`} title={String(value)}>
        {value}
      </div>
    </div>
  );
}

export default function TripDetailCard({ darkMode, selectedTrip }) {
  const isFM = selectedTrip.modality === 'FM';
  const dischargeStr = getDischargeTime(selectedTrip.hora_doca, selectedTrip.hora_finalizacao);
  const permTotalStr = getPermanenciaTotal(selectedTrip);

  return (
    <div className={`mt-3 p-3 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
      darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between border-b pb-1.5 border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-black text-sm text-orange-500 truncate">
            {selectedTrip.modality === 'FM' ? 'First Mile' : selectedTrip.modality === 'LH' ? 'Line Haul' : (selectedTrip.modality || 'Line Haul')}
          </span>
          {selectedTrip.vehicle_plate && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
              {selectedTrip.vehicle_plate}
            </span>
          )}
        </div>
        <span className={`font-mono font-bold text-xs shrink-0 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          {formatNumber(selectedTrip.total_packages)} PACOTES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center font-mono">
        {[
          ['FILA', selectedTrip.origin || '-'],
          ['Motorista', selectedTrip.driver_name || '-'],
          ['Sacas', isFM ? '-' : formatNumber(selectedTrip.volume_saca)],
          ['Scuttles', isFM ? '-' : formatNumber(selectedTrip.volume_scuttle)],
          ['Pallets', isFM ? '-' : formatNumber(selectedTrip.volume_pallet)],
          ['Total TOs', isFM ? '-' : formatNumber(getTotalTOs(selectedTrip))]
        ].map(([label, value]) => (
          <div key={label} className={`p-1.5 rounded border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`text-[10px] uppercase font-sans font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{label}</div>
            <div className={`font-bold text-xs truncate ${darkMode ? 'text-slate-100' : 'text-slate-800'}`} title={String(value)}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* COLUNAS COM HORA EM TIMEZONE CORRETO */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center font-mono">
        <InfoCell
          darkMode={darkMode}
          label="Tempo Fila"
          value={selectedTrip.waiting_time || '00:00'}
          valueClassName={getMetricColor('fila', selectedTrip.waiting_time, darkMode)}
        />
        <InfoCell
          darkMode={darkMode}
          label="Tempo Descarga"
          value={dischargeStr}
          valueClassName={getMetricColor('descarga', dischargeStr, darkMode)}
        />
        <InfoCell
          darkMode={darkMode}
          label="Permanência Total"
          value={permTotalStr}
          valueClassName={getMetricColor('permanencia', permTotalStr, darkMode)}
        />
        <InfoCell darkMode={darkMode} label="Hora Doca" value={formatTimestamptzToTime(selectedTrip.hora_doca)} />
        <InfoCell darkMode={darkMode} label="Hora Finalização" value={formatTimestamptzToTime(selectedTrip.hora_finalizacao)} />
      </div>
    </div>
  );
}
