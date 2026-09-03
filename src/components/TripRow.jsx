import { Fragment } from 'react';
import { Clock, CheckCircle2, AlertCircle, AlertTriangle, ChevronDown, ChevronRight, Truck } from 'lucide-react';
import { getDischargeTime, formatTimestamptzToTime } from '../lib/dateUtils';
import { getPermanenceStatus, getPermanenceTextColor } from '../lib/metricStyles';

function DetailField({ darkMode, label, value, valueClassName = '', truncate = false, title, centered = true }) {
  return (
    <div className={`p-3 rounded-xl border ${centered ? 'text-center' : ''} ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      <span
        className={`font-bold text-sm block mt-0.5 ${truncate ? 'truncate' : ''} ${valueClassName || (darkMode ? 'text-slate-100' : 'text-slate-800')}`}
        title={title}
      >
        {value}
      </span>
    </div>
  );
}

export default function TripRow({ trip, darkMode, isExpanded, onToggle, showSeparator }) {
  const permStatus = getPermanenceStatus(trip.permanencia);

  let statusBadgeClass = '';
  let StatusIcon = AlertCircle;

  if (trip.status === 'Finalizado') {
    if (permStatus === 'red') {
      statusBadgeClass = darkMode ? 'bg-red-950/80 text-red-300 border border-red-800' : 'bg-red-100 text-red-800 border border-red-300';
      StatusIcon = AlertTriangle;
    } else if (permStatus === 'yellow') {
      statusBadgeClass = darkMode ? 'bg-amber-950/60 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800 border border-amber-300';
      StatusIcon = AlertTriangle;
    } else {
      statusBadgeClass = darkMode ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-100 text-emerald-800';
      StatusIcon = CheckCircle2;
    }
  } else if (trip.status === 'Atribuído') {
    statusBadgeClass = darkMode ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800' : 'bg-indigo-100 text-indigo-800 border border-indigo-200';
  } else if (trip.status === 'Docado') {
    statusBadgeClass = darkMode ? 'bg-blue-950/60 text-blue-300' : 'bg-blue-100 text-blue-800';
  } else {
    statusBadgeClass = darkMode ? 'bg-amber-950/60 text-amber-300' : 'bg-amber-100 text-amber-800';
  }

  const dischargeTime = getDischargeTime(trip.hora_doca, trip.hora_finalizacao);

  return (
    <Fragment>
      {showSeparator && (
        <tr className={darkMode ? 'bg-slate-950/40' : 'bg-slate-50/30'}>
          <td colSpan={8} className="py-2.5 px-6">
            <div className={`h-px w-full border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
          </td>
        </tr>
      )}

      <tr
        onClick={onToggle}
        className={`cursor-pointer transition-colors font-medium ${
          isExpanded
            ? darkMode ? 'bg-amber-950/40 text-white' : 'bg-amber-100/70 text-slate-800'
            : darkMode ? 'hover:bg-slate-800/50 text-slate-200' : 'hover:bg-slate-50/80 text-slate-800'
        }`}
      >
        <td className="py-4 px-2 text-center text-slate-400">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-orange-500 mx-auto" />
          ) : (
            <ChevronRight className="w-5 h-5 mx-auto" />
          )}
        </td>

        <td className="py-4 px-4 whitespace-nowrap">
          <span className={`inline-block px-3 py-1 rounded-lg font-black text-lg ${
            darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
          }`}>
            {trip.origin || '-'}
          </span>
        </td>

        <td className={`py-4 px-4 font-bold text-base uppercase whitespace-nowrap ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          {trip.vehicle_plate || '-'}
        </td>

        <td className="py-4 px-4 text-center whitespace-nowrap">
          <span className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-xs sm:text-sm ${
            darkMode ? 'bg-emerald-950/50 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <Clock className="w-4 h-4" />
            {trip.waiting_time || '00:00'}
          </span>
        </td>

        <td className="py-4 px-4 text-center whitespace-nowrap">
          <span
            className={`inline-block px-3 py-1 rounded-lg font-black text-xs sm:text-sm ${
              trip.modality === 'FM'
                ? darkMode ? 'bg-red-950/50 text-red-400' : 'bg-red-100 text-red-700'
                : darkMode ? 'bg-blue-950/50 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {trip.modality || 'LH'}
          </span>
        </td>

        <td className={`py-4 px-4 text-right font-bold text-base whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {(trip.total_packages || 0).toLocaleString('pt-BR')} <span className="text-xs font-bold text-slate-400">pcs</span>
        </td>

        <td className={`py-4 px-4 text-center font-bold text-base whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {trip.dock_number || '-'}
        </td>

        <td className="py-4 px-4 text-center whitespace-nowrap">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase ${statusBadgeClass}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{trip.status || 'Em fila'}</span>
          </span>
        </td>
      </tr>

      {isExpanded && (
        <tr className={darkMode ? 'bg-slate-950/60 border-t border-b border-slate-800' : 'bg-amber-50/50 border-t border-b border-amber-200/80'}>
          <td colSpan={8} className="p-4 sm:p-5">
            <div className={`p-5 rounded-2xl border shadow-sm transition-colors duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>Detalhes do Veículo ({trip.origin})</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-9 gap-3 sm:gap-4">
                <DetailField darkMode={darkMode} label="Motorista" value={trip.driver_name || '-'} centered={false} truncate title={trip.driver_name || '-'} />
                <DetailField darkMode={darkMode} label="Nº da LT" value={trip.modality === 'FM' ? '-' : (trip.lt_number || '-')} centered={false} truncate />
                <DetailField darkMode={darkMode} label="Hora Doca" value={formatTimestamptzToTime(trip.hora_doca)} />
                <DetailField darkMode={darkMode} label="Hora Finalização" value={formatTimestamptzToTime(trip.hora_finalizacao)} />
                <DetailField
                  darkMode={darkMode}
                  label="Tempo de Descarga"
                  value={dischargeTime}
                  valueClassName={darkMode ? 'text-orange-400' : 'text-orange-500'}
                />
                <DetailField
                  darkMode={darkMode}
                  label="Tempo de Permanência"
                  value={trip.permanencia || '-'}
                  valueClassName={getPermanenceTextColor(permStatus, darkMode)}
                />
                <DetailField darkMode={darkMode} label="Sacas" value={trip.volume_saca ?? 0} valueClassName={darkMode ? 'text-white' : 'text-slate-900'} />
                <DetailField darkMode={darkMode} label="Scuttles" value={trip.volume_scuttle ?? 0} valueClassName={darkMode ? 'text-white' : 'text-slate-900'} />
                <DetailField darkMode={darkMode} label="Pallets" value={trip.volume_pallet ?? 0} valueClassName={darkMode ? 'text-white' : 'text-slate-900'} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
