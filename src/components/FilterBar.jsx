import { Fragment } from 'react';
import { Send } from 'lucide-react';
import { STATUS_LIST } from '../constants';

export default function FilterBar({
  darkMode,
  selectedStatus,
  onStatusToggle,
  dynamicCountsByStatus,
  onOpenReport,
  selectedModality,
  onModalityToggle,
  dynamicCountsByModality
}) {
  return (
    <div className={`p-4 rounded-2xl shadow-sm border mb-6 flex flex-wrap items-center justify-between gap-4 transition-colors duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-500 uppercase tracking-wider text-xs font-extrabold mr-1">
          Filtros de Status:
        </span>

        {STATUS_LIST.map((status, index, array) => {
          const isActive = selectedStatus[status];
          return (
            <Fragment key={status}>
              <label className="flex items-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onStatusToggle(status)}
                    className={`peer appearance-none w-4 h-4 rounded cursor-pointer transition-colors focus:outline-none ${darkMode ? 'bg-slate-800 checked:bg-orange-500' : 'bg-slate-200 checked:bg-orange-500'}`}
                  />
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <span
                  className={`flex items-center gap-1.5 uppercase text-xs transition-all ${
                    isActive
                      ? darkMode ? 'font-black text-white' : 'font-black text-slate-900'
                      : 'font-semibold text-slate-400'
                  }`}
                >
                  {status}:{' '}
                  <strong
                    className={`text-sm px-2 py-0.5 rounded-md transition-all ${
                      isActive
                        ? darkMode ? 'font-black text-white bg-slate-800' : 'font-black text-slate-900 bg-slate-100'
                        : darkMode ? 'font-semibold text-slate-500 bg-slate-800/40' : 'font-semibold text-slate-400 bg-slate-100/60'
                    }`}
                  >
                    {dynamicCountsByStatus[status] || 0}
                  </strong>
                </span>
              </label>

              {index < array.length - 1 && <span className={darkMode ? 'text-slate-700' : 'text-slate-200'}>|</span>}
            </Fragment>
          );
        })}
      </div>

      {/* BOTÃO "RESUMO INBOUND" */}
      <div>
        <button
          onClick={onOpenReport}
          className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          <Send size={14} className="rotate-45" />
          <span>Resumo Inbound</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-500 uppercase tracking-wider text-xs font-extrabold mr-1">
          Modalidade:
        </span>

        <button
          type="button"
          onClick={() => onModalityToggle('FM')}
          className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
            selectedModality['FM']
              ? darkMode ? 'bg-red-950/40 border-red-800 text-red-400 shadow-sm font-black' : 'bg-red-50 border-red-300 text-red-700 shadow-sm font-black'
              : darkMode ? 'bg-slate-800 border-slate-700 text-slate-500 font-normal' : 'bg-slate-100 border-slate-200 text-slate-400 font-normal'
          }`}
        >
          <span>FM</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-xs ${
              selectedModality['FM']
                ? darkMode ? 'bg-red-900/60 text-red-300 font-black' : 'bg-red-100 text-red-800 font-black'
                : darkMode ? 'bg-slate-800 text-slate-500 font-normal' : 'bg-slate-200/60 text-slate-400 font-normal'
            }`}
          >
            {dynamicCountsByModality['FM'] || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onModalityToggle('LH')}
          className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
            selectedModality['LH']
              ? darkMode ? 'bg-blue-950/40 border-blue-800 text-blue-400 shadow-sm font-black' : 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm font-black'
              : darkMode ? 'bg-slate-800 border-slate-700 text-slate-500 font-normal' : 'bg-slate-100 border-slate-200 text-slate-400 font-normal'
          }`}
        >
          <span>LH</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-xs ${
              selectedModality['LH']
                ? darkMode ? 'bg-blue-900/60 text-blue-300 font-black' : 'bg-blue-100 text-blue-800 font-black'
                : darkMode ? 'bg-slate-800 text-slate-500 font-normal' : 'bg-slate-200/60 text-slate-400 font-normal'
            }`}
          >
            {dynamicCountsByModality['LH'] || 0}
          </span>
        </button>
      </div>
    </div>
  );
}
