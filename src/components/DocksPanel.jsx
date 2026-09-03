import { DOCKS_INTERNAL, DOCKS_EXTERNAL } from '../constants';

function DockBadge({ dock, isOccupied, darkMode }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
        isOccupied
          ? darkMode ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800 font-black' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 shadow-sm shadow-emerald-500/10 font-black'
          : darkMode ? 'bg-slate-800 text-slate-500 border-slate-700 font-normal' : 'bg-slate-100 text-slate-400 border-slate-200 font-normal'
      }`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          isOccupied
            ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse'
            : darkMode ? 'bg-slate-600' : 'bg-slate-400'
        }`}
      ></span>
      <span>{dock}</span>
    </div>
  );
}

export default function DocksPanel({ darkMode, filteredCount, totalCount, occupiedDocks, fallbackDateLabel }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/60 text-slate-600'}`}>
          Exibindo {filteredCount} de {totalCount} veículos
        </span>

        {fallbackDateLabel && (
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 border ${
              darkMode ? 'bg-amber-950/40 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
            title="Ainda não há registros para hoje; exibindo o dia mais recente com dados."
          >
            Sem dados para hoje — mostrando {fallbackDateLabel}
          </span>
        )}
      </div>

      <div className={`flex flex-wrap items-center gap-2 px-4 py-1.5 rounded-xl shadow-sm border transition-colors duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1">
          Docas:
        </span>

        {DOCKS_INTERNAL.map((dock) => (
          <DockBadge key={dock} dock={dock} isOccupied={occupiedDocks.has(dock)} darkMode={darkMode} />
        ))}

        <div className={`h-5 w-px mx-1 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

        {DOCKS_EXTERNAL.map((dock) => (
          <DockBadge key={dock} dock={dock} isOccupied={occupiedDocks.has(dock)} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}
