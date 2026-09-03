import { Truck, TrendingUp, PackageCheck, Sun, Moon, Search, RefreshCw } from 'lucide-react';

function ForecastBadge({ modalityLabel, variant }) {
  const colorsByVariant = {
    forecast: {
      FM: 'bg-red-100 text-red-700',
      LH: 'bg-blue-100 text-blue-700',
      'FM + LH': 'bg-orange-100 text-orange-800'
    },
    recebido: {
      FM: 'bg-red-100 text-red-700',
      LH: 'bg-blue-100 text-blue-700',
      'FM + LH': 'bg-emerald-100 text-emerald-800'
    }
  };

  const className = colorsByVariant[variant][modalityLabel] || 'bg-slate-200 text-slate-500';

  return (
    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${className}`}>
      {modalityLabel}
    </span>
  );
}

export default function DashboardHeader({
  darkMode,
  onToggleDarkMode,
  totalForecastPackages,
  totalReceivedPackages,
  modalityLabel,
  searchTerm,
  onSearchTermChange,
  onRefresh,
  loading,
  lastSync
}) {
  return (
    <header className={`border-b-4 border-orange-500 shadow-sm px-6 py-4 mb-6 transition-colors duration-200 ${darkMode ? 'bg-slate-900 border-orange-500' : 'bg-white'}`}>
      <div className="w-[80%] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-orange-500 text-white p-2.5 rounded-xl shadow-md shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Painel Inbound - SPX
            </h1>
            <p className={`text-xs font-bold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              Monitoramento de Fila e Descarregamento em Tempo Real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className={`flex items-center gap-3 border px-4 py-2 rounded-2xl shadow-inner ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'}`}>
            <div className="bg-orange-500 text-white p-2 rounded-xl shadow-sm shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Total Forecast
                </span>
                <ForecastBadge modalityLabel={modalityLabel} variant="forecast" />
              </div>
              <div className={`text-lg font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {totalForecastPackages.toLocaleString('pt-BR')} <span className="text-xs font-bold text-slate-500">pcs</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 border px-4 py-2 rounded-2xl shadow-inner ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'}`}>
            <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-sm shrink-0">
              <PackageCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Total Recebido
                </span>
                <ForecastBadge modalityLabel={modalityLabel} variant="recebido" />
              </div>
              <div className={`text-lg font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {totalReceivedPackages.toLocaleString('pt-BR')} <span className="text-xs font-bold text-slate-500">pcs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className={`flex items-center gap-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer h-10 shrink-0 ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Alternar Tema Claro / Escuro"
          >
            {darkMode ? (
              <>
                <Sun size={14} className="text-amber-400" />
                <span>Claro</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-slate-600" />
                <span>Escuro</span>
              </>
            )}
          </button>

          <div className="relative w-48 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Buscar fila, Placa..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className={`w-full pl-8 pr-3 h-10 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="relative flex flex-col items-center shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 h-10 rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>

            {lastSync && (
              <span className="absolute top-full left-0 right-0 text-center text-[10px] font-bold text-slate-400 whitespace-nowrap pt-1">
                Última sync: {lastSync}
              </span>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
