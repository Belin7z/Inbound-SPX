import { forwardRef } from 'react';
import { formatNumber, getMetricColor } from '../../lib/metricStyles';

function MetricRow({ darkMode, label, total, lh, fm, colorFn, highlight = false }) {
  return (
    <div className={`py-2.5 px-2.5 ${highlight ? 'bg-orange-50/10 dark:bg-orange-950/10' : ''}`}>
      <div className="flex justify-between items-center">
        <span className={highlight ? (darkMode ? 'text-orange-300' : 'text-orange-700') : (darkMode ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
        <span className={colorFn ? colorFn(total) : (darkMode ? 'text-slate-100' : 'text-slate-900')}>{total}</span>
      </div>
      <div className="flex justify-between items-center text-[11px] font-semibold mt-0.5">
        <span>
          <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>LH: </span>
          <span className={colorFn ? colorFn(lh) : (darkMode ? 'text-slate-100' : 'text-slate-900')}>{lh}</span>
        </span>
        <span>
          <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>FM: </span>
          <span className={colorFn ? colorFn(fm) : (darkMode ? 'text-slate-100' : 'text-slate-900')}>{fm}</span>
        </span>
      </div>
    </div>
  );
}

const ReportSidebar = forwardRef(function ReportSidebar({ darkMode, selectedTurnos, metrics, veiculosDescarregando }, ref) {
  const {
    totalCarrosRecebidos, totalCarrosLH, totalCarrosFM,
    totalPacotesRecebidos, totalPacotesLH, totalPacotesFM,
    tempoFilaMedioStr, tempoFilaLHStr, tempoFilaFMStr,
    tempoDescargaMedioStr, tempoDescargaLHStr, tempoDescargaFMStr,
    tempoPermanenciaMedioStr, tempoPermanenciaLHStr, tempoPermanenciaFMStr
  } = metrics;

  return (
    <aside ref={ref} className="space-y-2 min-w-0">
      <div className={`border rounded-lg overflow-hidden shadow-sm text-xs font-mono font-bold ${
        darkMode ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="bg-orange-500 text-white py-2 px-2.5 font-black font-sans uppercase text-[11px] tracking-wider flex items-center justify-between gap-3 h-[36px]">
          <span className="text-left">RESUMO TURNO</span>
          <span className="bg-white text-orange-600 border border-white rounded-md px-3 py-1 text-[10px] font-black tracking-wide normal-case leading-none shadow-sm min-w-[48px] text-center">
            {selectedTurnos.length === 0 ? 'TODOS' : selectedTurnos.join(' + ')}
          </span>
        </div>

        <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
          <MetricRow
            darkMode={darkMode}
            label="VEÍCULOS RECEBIDOS"
            total={formatNumber(totalCarrosRecebidos)}
            lh={formatNumber(totalCarrosLH)}
            fm={formatNumber(totalCarrosFM)}
          />
          <MetricRow
            darkMode={darkMode}
            label="PACOTES RECEBIDOS"
            total={formatNumber(totalPacotesRecebidos)}
            lh={formatNumber(totalPacotesLH)}
            fm={formatNumber(totalPacotesFM)}
          />
          <MetricRow
            darkMode={darkMode}
            label="TEMPO DE FILA"
            total={tempoFilaMedioStr}
            lh={tempoFilaLHStr}
            fm={tempoFilaFMStr}
            colorFn={(v) => getMetricColor('fila', v, darkMode)}
          />
          <MetricRow
            darkMode={darkMode}
            label="TEMPO DE DESCARGA"
            total={tempoDescargaMedioStr}
            lh={tempoDescargaLHStr}
            fm={tempoDescargaFMStr}
            colorFn={(v) => getMetricColor('descarga', v, darkMode)}
          />
          <MetricRow
            darkMode={darkMode}
            label="TEMPO DE PERMANÊNCIA"
            total={tempoPermanenciaMedioStr}
            lh={tempoPermanenciaLHStr}
            fm={tempoPermanenciaFMStr}
            colorFn={(v) => getMetricColor('permanencia', v, darkMode)}
            highlight
          />
        </div>
      </div>

      {/* CARD EM DESCARREGAMENTO */}
      <div className={`border rounded-lg overflow-hidden shadow-sm text-xs font-mono font-bold bg-transparent ${
        darkMode ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="bg-orange-500 text-white py-2 px-2 text-center font-black font-sans uppercase text-[11px] tracking-wider h-[36px] flex items-center justify-center">
          EM DESCARREGAMENTO
        </div>

        {veiculosDescarregando.length === 0 ? (
          <div className="py-3 px-2 text-center text-slate-400 font-sans text-[11px]">
            Nenhum veículo em descarregamento
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
            {veiculosDescarregando.map((trip, idx) => (
              <div key={`${trip.id || 'docado'}-${idx}`} className="py-1.5 px-2 font-mono">
                <div className="grid grid-cols-4 items-center text-center gap-1 text-[11px]">
                  <div className="min-w-0 flex flex-col items-center">
                    <span className="text-slate-400 uppercase text-[9px] font-semibold leading-none mb-0.5">FILA</span>
                    <span className={`font-bold truncate w-full ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      {trip.origin || '-'}
                    </span>
                  </div>
                  <div className="min-w-0 flex flex-col items-center">
                    <span className="text-slate-400 uppercase text-[9px] font-semibold leading-none mb-0.5">MOD</span>
                    <span className={`font-bold truncate w-full ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      {trip.modality || 'LH'}
                    </span>
                  </div>
                  <div className="min-w-0 flex flex-col items-center">
                    <span className="text-slate-400 uppercase text-[9px] font-semibold leading-none mb-0.5">PCTS</span>
                    <span className={`font-bold truncate w-full ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      {formatNumber(trip.total_packages)}
                    </span>
                  </div>
                  <div className="min-w-0 flex flex-col items-center">
                    <span className="text-slate-400 uppercase text-[9px] font-semibold leading-none mb-0.5">DOCA</span>
                    <span className={`font-bold truncate w-full ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      {trip.dock_number || '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

export default ReportSidebar;
