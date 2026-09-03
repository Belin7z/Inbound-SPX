export const getOccupiedDocks = (trips) => {
  return trips.reduce((acc, trip) => {
    if (trip.dock_number && trip.status !== 'Finalizado') {
      acc.add(trip.dock_number.trim());
    }
    return acc;
  }, new Set());
};

export const getTotalReceivedPackages = (trips, selectedModality) => {
  return trips.reduce((acc, trip) => {
    if (trip.status === 'Finalizado') {
      const tripModality = trip.modality || 'LH';
      if (selectedModality[tripModality]) {
        return acc + (Number(trip.total_packages) || 0);
      }
    }
    return acc;
  }, 0);
};

export const getTotalForecastPackages = (forecastData, selectedModality) => {
  let total = 0;
  if (selectedModality['FM']) total += forecastData.forecast_fm;
  if (selectedModality['LH']) total += forecastData.forecast_lh;
  return total;
};

export const getModalityLabel = (selectedModality) => {
  if (selectedModality['FM'] && selectedModality['LH']) return 'FM + LH';
  if (selectedModality['FM']) return 'FM';
  if (selectedModality['LH']) return 'LH';
  return 'NENHUM';
};

export const getCountsByStatus = (trips, selectedModality) => {
  return trips.reduce((acc, trip) => {
    const tripModality = trip.modality || 'LH';
    if (selectedModality[tripModality]) {
      const st = trip.status || 'Em fila';
      acc[st] = (acc[st] || 0) + 1;
    }
    return acc;
  }, {});
};

export const getCountsByModality = (trips, selectedStatus) => {
  return trips.reduce((acc, trip) => {
    const tripStatus = trip.status || 'Em fila';
    if (selectedStatus[tripStatus]) {
      const mod = trip.modality || 'LH';
      acc[mod] = (acc[mod] || 0) + 1;
    }
    return acc;
  }, {});
};

export const getFilteredTrips = (trips, selectedStatus, selectedModality, searchTerm) => {
  const search = searchTerm.toLowerCase();

  return trips.filter((trip) => {
    const tripStatus = trip.status || 'Em fila';
    const tripModality = trip.modality || 'LH';

    if (!selectedStatus[tripStatus]) return false;
    if (!selectedModality[tripModality]) return false;

    return (
      (trip.origin && trip.origin.toLowerCase().includes(search)) ||
      (trip.vehicle_plate && trip.vehicle_plate.toLowerCase().includes(search)) ||
      (trip.driver_name && trip.driver_name.toLowerCase().includes(search)) ||
      (trip.status && trip.status.toLowerCase().includes(search)) ||
      (trip.lt_number && trip.lt_number.toLowerCase().includes(search)) ||
      (trip.dock_number && trip.dock_number.toLowerCase().includes(search))
    );
  });
};
