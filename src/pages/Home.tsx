import React, { useState } from 'react';
import { Bus, MapPin, AlertCircle, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import { BusRoute } from '../types/bus';
import { PREDEFINED_BUS_ROUTES } from '../data/busRoutes';
import { SearchBox } from '../components/SearchBox';
import { BusCard } from '../components/BusCard';

interface HomeProps {
  onViewRoute: (bus: BusRoute, destination?: string) => void;
  onViewSeatMap: (bus: BusRoute) => void;
  onNavigateTab: (tab: 'home' | 'find' | 'routes' | 'dashboard' | 'about') => void;
  buses: BusRoute[];
  bookedBuses: string[];
  onToggleBookSeat: (busId: string) => void;
  initialQuery?: string;
  onUpdateSearchedTerm?: (term: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onViewRoute,
  onViewSeatMap,
  onNavigateTab,
  buses,
  bookedBuses,
  onToggleBookSeat,
  initialQuery = '',
  onUpdateSearchedTerm,
}) => {
  const [searchedTerm, setSearchedTerm] = useState<string>(initialQuery);
  const [matchingBuses, setMatchingBuses] = useState<BusRoute[]>(() => {
    if (!initialQuery) return [];
    return buses.filter((bus) =>
      bus.stops.some((stop) => stop.toLowerCase().includes(initialQuery.trim().toLowerCase()))
    );
  });
  const [hasSearched, setHasSearched] = useState<boolean>(Boolean(initialQuery));

  const handleSearch = (destination: string) => {
    const trimmed = destination.trim();
    setSearchedTerm(trimmed);
    setHasSearched(true);
    if (onUpdateSearchedTerm) {
      onUpdateSearchedTerm(trimmed);
    }

    if (!trimmed) {
      setMatchingBuses([]);
      return;
    }

    // Check whether destination exists in stops of each bus (case-insensitive)
    const matches = buses.filter((bus) =>
      bus.stops.some((stop) => stop.toLowerCase() === trimmed.toLowerCase() ||
        stop.toLowerCase().includes(trimmed.toLowerCase())
      )
    );

    setMatchingBuses(matches);
  };

  const handleResetSearch = () => {
    setSearchedTerm('');
    setHasSearched(false);
    setMatchingBuses([]);
    if (onUpdateSearchedTerm) {
      onUpdateSearchedTerm('');
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner with Search Section */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold tracking-wide border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            Official Campus Transportation Portal
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            College Bus Route & Seat Management
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
            Find your bus, check your route, and view available seats.
          </p>

          {/* Search Box Component */}
          <div className="pt-6">
            <SearchBox onSearch={handleSearch} initialValue={searchedTerm} />
          </div>
        </div>
      </section>

      {/* Search Results Area */}
      {hasSearched && (
        <section id="search-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          {matchingBuses.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">🚌</span> Matching College Bus Found
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing buses serving destination:{' '}
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                      {searchedTerm}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Search</span>
                </button>
              </div>

              {/* Exact Matching Bus Display Callout matching prompt sample */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingBuses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    searchedDestination={searchedTerm}
                    onViewRoute={(b) => onViewRoute(b, searchedTerm)}
                    onViewSeatMap={onViewSeatMap}
                    onBookSeat={onToggleBookSeat}
                    isBookedByStudent={bookedBuses.includes(bus.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* No Bus Available - Exact Requirements Section */
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-10 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">
                  Bus/Route Not Available
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We couldn&apos;t find a college bus serving this destination. Please try another destination.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Search Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('routes')}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                >
                  <span>View All 4 College Routes</span>
                </button>
              </div>

              {/* Helpful suggestions */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 block mb-2">Available College Stops:</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {[
                    'JP Nagar',
                    'Jayanagar',
                    'Electronic City',
                    'Bommasandra',
                    'Hosur',
                    'Attibele',
                    'Banashankari',
                    'BTM Layout',
                    'Silk Board',
                    'Koramangala',
                  ].map((stop) => (
                    <button
                      key={stop}
                      type="button"
                      onClick={() => handleSearch(stop)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md border border-slate-200 transition-colors cursor-pointer text-xs"
                    >
                      {stop}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* All Available College Routes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Active College Bus Routes (Today&apos;s Schedule)
            </h2>
            <p className="text-xs text-slate-500">
              Departure time: 04:45 PM from Main Campus Gate 2 Bay 1–4
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('routes')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore all route stops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {buses.map((bus) => (
            <BusCard
              key={bus.id}
              bus={bus}
              searchedDestination={searchedTerm}
              onViewRoute={onViewRoute}
              onViewSeatMap={onViewSeatMap}
              onBookSeat={onToggleBookSeat}
              isBookedByStudent={bookedBuses.includes(bus.id)}
            />
          ))}
        </div>
      </section>

      {/* College Project Notice & Quick Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Fixed Shift Departures</h4>
                <p className="text-xs text-slate-600 mt-1">
                  All buses depart from campus bays promptly at 04:45 PM. Students are advised to be seated 10 minutes prior.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Guaranteed Seat Capacity</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Each college coach has 40 seats. Real-time availability indicator prevents overcrowding and safety hazards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Identity & Safety First</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Keep your digital or physical college bus pass ready for verification by the driver during boarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
