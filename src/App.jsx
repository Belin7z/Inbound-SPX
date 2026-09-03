import { useState } from 'react';
import { useTrips } from './hooks/useTrips';
import { formatOperationalDateLabel } from './lib/dateUtils';
import {
  getOccupiedDocks,
  getTotalReceivedPackages,
  getTotalForecastPackages,
  getModalityLabel,
  getCountsByStatus,
  getCountsByModality,
  getFilteredTrips
} from './lib/tripSelectors';
import DashboardHeader from './components/DashboardHeader';
import FilterBar from './components/FilterBar';
import DocksPanel from './components/DocksPanel';
import TripsTable from './components/TripsTable';
import InboundReportModal from './components/InboundReportModal/InboundReportModal';

export default function App() {
  const { trips, forecastData, loading, lastSync, isFallbackDate, displayedDate, refetch } = useTrips();

  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState({
    'Em fila': true,
    'Atribuído': true,
    'Docado': true,
    'Finalizado': true
  });

  const [selectedModality, setSelectedModality] = useState({
    'FM': true,
    'LH': true
  });

  const handleStatusToggle = (status) => {
    setSelectedStatus(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const handleModalityToggle = (modality) => {
    setSelectedModality(prev => ({ ...prev, [modality]: !prev[modality] }));
  };

  const toggleRowExpand = (id) => {
    setExpandedTripId(prevId => prevId === id ? null : id);
  };

  const occupiedDocks = getOccupiedDocks(trips);
  const totalReceivedPackages = getTotalReceivedPackages(trips, selectedModality);
  const totalForecastPackages = getTotalForecastPackages(forecastData, selectedModality);
  const modalityLabel = getModalityLabel(selectedModality);
  const dynamicCountsByStatus = getCountsByStatus(trips, selectedModality);
  const dynamicCountsByModality = getCountsByModality(trips, selectedStatus);
  const filteredTrips = getFilteredTrips(trips, selectedStatus, selectedModality, searchTerm);

  return (
    <div className={`min-h-screen font-sans pb-12 transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

      <DashboardHeader
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        totalForecastPackages={totalForecastPackages}
        totalReceivedPackages={totalReceivedPackages}
        modalityLabel={modalityLabel}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onRefresh={refetch}
        loading={loading}
        lastSync={lastSync}
      />

      <div className="w-[80%] mx-auto px-2">
        <FilterBar
          darkMode={darkMode}
          selectedStatus={selectedStatus}
          onStatusToggle={handleStatusToggle}
          dynamicCountsByStatus={dynamicCountsByStatus}
          onOpenReport={() => setIsReportOpen(true)}
          selectedModality={selectedModality}
          onModalityToggle={handleModalityToggle}
          dynamicCountsByModality={dynamicCountsByModality}
        />

        <DocksPanel
          darkMode={darkMode}
          filteredCount={filteredTrips.length}
          totalCount={trips.length}
          occupiedDocks={occupiedDocks}
          fallbackDateLabel={isFallbackDate ? formatOperationalDateLabel(displayedDate) : null}
        />

        <TripsTable
          darkMode={darkMode}
          filteredTrips={filteredTrips}
          loading={loading}
          expandedTripId={expandedTripId}
          onToggleRow={toggleRowExpand}
        />
      </div>

      {isReportOpen && (
        <InboundReportModal
          onClose={() => setIsReportOpen(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
