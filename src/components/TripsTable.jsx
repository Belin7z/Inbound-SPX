import TripRow from './TripRow';

export default function TripsTable({ darkMode, filteredTrips, loading, expandedTripId, onToggleRow }) {
  return (
    <main className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className={`border-b text-xs font-black uppercase tracking-wider ${darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100/80 border-slate-200/80 text-slate-600'}`}>
              <th className="py-4 px-2 w-[4%] text-center"></th>
              <th className="py-4 px-4 w-[13%]">Nº da Fila</th>
              <th className="py-4 px-4 w-[13%]">Placa</th>
              <th className="py-4 px-4 w-[14%] text-center">Tempo Espera</th>
              <th className="py-4 px-4 w-[13%] text-center">Modalidade</th>
              <th className="py-4 px-4 w-[15%] text-right">Total Pacotes</th>
              <th className="py-4 px-4 w-[13%] text-center">Doca</th>
              <th className="py-4 px-4 w-[15%] text-center">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {filteredTrips.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 font-medium text-base">
                  Nenhuma viagem encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredTrips.map((trip, index) => {
                const previousStatus = index > 0 ? filteredTrips[index - 1].status : null;
                const isNewStatusGroup = index > 0 && trip.status !== previousStatus;

                return (
                  <TripRow
                    key={trip.id}
                    trip={trip}
                    darkMode={darkMode}
                    isExpanded={expandedTripId === trip.id}
                    onToggle={() => onToggleRow(trip.id)}
                    showSeparator={isNewStatusGroup}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
