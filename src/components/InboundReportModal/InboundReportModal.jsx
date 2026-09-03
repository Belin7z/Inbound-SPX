import { useEffect, useRef, useState } from 'react';
import { Inbox, X } from 'lucide-react';
import { useInboundReport } from '../../hooks/useInboundReport';
import { copyElementAsPng } from '../../lib/screenshotUtils';
import ReportFilters from './ReportFilters';
import ReportSidebar from './ReportSidebar';
import VehiclesTable from './VehiclesTable';
import TripDetailCard from './TripDetailCard';

export default function InboundReportModal({ onClose, darkMode }) {
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [selectedDataFilter, setSelectedDataFilter] = useState('HOJE');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(null);

  const reportAreaRef = useRef(null);
  const sidebarRef = useRef(null);

  const {
    loading,
    filteredFinalizedTrips,
    veiculosDescarregando,
    ...metrics
  } = useInboundReport(selectedTurnos, selectedDataFilter);

  useEffect(() => {
    if (!sidebarRef.current) return;

    const updateSidebarHeight = () => {
      setSidebarHeight(sidebarRef.current?.getBoundingClientRect().height || null);
    };

    updateSidebarHeight();

    const observer = new ResizeObserver(updateSidebarHeight);
    observer.observe(sidebarRef.current);
    window.addEventListener('resize', updateSidebarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSidebarHeight);
    };
  }, []);

  useEffect(() => {
    if (filteredFinalizedTrips.length === 0) {
      setSelectedTrip(null);
      return;
    }

    const aindaExiste = selectedTrip && filteredFinalizedTrips.some(trip => trip.id === selectedTrip.id);
    if (!aindaExiste) {
      setSelectedTrip(filteredFinalizedTrips[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredFinalizedTrips]);

  const toggleTurno = (turno) => {
    if (turno === 'TODOS') {
      setSelectedTurnos([]);
      return;
    }

    setSelectedTurnos(prev =>
      prev.includes(turno) ? prev.filter(t => t !== turno) : [...prev, turno]
    );
  };

  const handleCopyPrint = async () => {
    if (!reportAreaRef.current) return;
    setCapturing(true);

    try {
      await copyElementAsPng(reportAreaRef.current, {
        backgroundColor: darkMode ? '#0F172A' : '#FFFFFF',
        filenamePrefix: 'Resumo_Inbound'
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Erro ao tirar o print:', error);
      alert('Erro ao tirar print: ' + error.message);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div className={`w-full max-w-[1200px] rounded-2xl shadow-2xl border overflow-y-auto flex flex-col max-h-[96vh] transition-colors ${
        darkMode ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-white text-slate-800 border-slate-200'
      }`}>

        {/* CABEÇALHO DO MODAL */}
        <div className={`p-3 border-b flex items-center justify-between shrink-0 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Inbox className="text-orange-500" size={20} />
            <h3 className="text-lg font-black uppercase font-mono tracking-wider">
              Veículos Recebidos - Report Operação
            </h3>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <ReportFilters
          darkMode={darkMode}
          selectedDataFilter={selectedDataFilter}
          onSelectDataFilter={setSelectedDataFilter}
          selectedTurnos={selectedTurnos}
          onToggleTurno={toggleTurno}
          onCopy={handleCopyPrint}
          copied={copied}
          capturing={capturing}
        />

        {/* ÁREA DO REPORT */}
        <div ref={reportAreaRef} className={`px-4 md:px-5 pb-4 flex-none ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-[235px_minmax(0,1fr)] gap-3 h-full min-h-0 items-start">
            <ReportSidebar
              ref={sidebarRef}
              darkMode={darkMode}
              selectedTurnos={selectedTurnos}
              metrics={metrics}
              veiculosDescarregando={veiculosDescarregando}
            />

            <VehiclesTable
              darkMode={darkMode}
              loading={loading}
              filteredFinalizedTrips={filteredFinalizedTrips}
              totalCarrosRecebidos={metrics.totalCarrosRecebidos}
              selectedTrip={selectedTrip}
              onSelectTrip={setSelectedTrip}
              height={sidebarHeight}
            />
          </div>

          {selectedTrip && (
            <TripDetailCard darkMode={darkMode} selectedTrip={selectedTrip} />
          )}
        </div>
      </div>
    </div>
  );
}
