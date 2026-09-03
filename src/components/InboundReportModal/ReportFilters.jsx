import { Check, Camera } from 'lucide-react';

const DATA_FILTERS = [
  { id: 'HOJE', label: 'HOJE' },
  { id: 'D-1', label: 'D-1' },
  { id: 'D-2', label: 'D-2' },
  { id: 'TODOS', label: 'TODOS' }
];

const TURNOS = ['T1', 'T2', 'T3', 'T4'];

export default function ReportFilters({
  darkMode,
  selectedDataFilter,
  onSelectDataFilter,
  selectedTurnos,
  onToggleTurno,
  onCopy,
  copied,
  capturing
}) {
  return (
    <div className="px-4 md:px-5 pt-2 pb-1">
      <div className="border-b py-2 border-slate-200 dark:border-slate-700 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 justify-self-start">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Data:</span>
          <div className="flex items-center gap-1">
            {DATA_FILTERS.map(df => (
              <button
                key={df.id}
                onClick={() => onSelectDataFilter(df.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedDataFilter === df.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>
        </div>

        <div className="justify-self-center">
          <button
            onClick={onCopy}
            disabled={capturing}
            className={`flex items-center justify-center gap-1.5 px-5 py-1.5 rounded-lg font-bold text-xs shadow-sm transition cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {copied ? <Check size={14} /> : <Camera size={14} />}
            <span>
              {capturing ? 'Gerando Resumo...' : copied ? 'Resumo Copiado!' : 'Copiar Resumo'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Turno:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleTurno('TODOS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedTurnos.length === 0
                  ? 'bg-orange-500 text-white shadow-sm'
                  : darkMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              TODOS
            </button>

            {TURNOS.map(turno => {
              const isSelected = selectedTurnos.includes(turno);
              return (
                <button
                  key={turno}
                  onClick={() => onToggleTurno(turno)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-sm'
                      : darkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{turno}</span>
                  {isSelected && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
