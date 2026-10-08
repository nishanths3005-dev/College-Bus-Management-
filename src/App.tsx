import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RouteModal } from './components/RouteModal';
import { SeatLayoutModal } from './components/SeatLayoutModal';
import { Home } from './pages/Home';
import { RoutesPage } from './pages/RoutesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { PREDEFINED_BUS_ROUTES } from './data/busRoutes';
import { BusRoute } from './types/bus';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'find' | 'routes' | 'dashboard' | 'about'>('home');
  const [buses, setBuses] = useState<BusRoute[]>(PREDEFINED_BUS_ROUTES);
  const [selectedRouteBus, setSelectedRouteBus] = useState<BusRoute | null>(null);
  const [selectedSeatBus, setSelectedSeatBus] = useState<BusRoute | null>(null);
  const [searchedDestination, setSearchedDestination] = useState<string>('');
  const [bookedBuses, setBookedBuses] = useState<string[]>([]);

  // Open Route Modal
  const handleViewRoute = (bus: BusRoute, destination?: string) => {
    setSelectedRouteBus(bus);
    if (destination !== undefined) {
      setSearchedDestination(destination);
    }
  };

  // Open Seat Layout Modal
  const handleViewSeatMap = (bus: BusRoute) => {
    setSelectedSeatBus(bus);
  };

  // Seat booking simulation (updates in-memory available seats & recalculates live stats)
  const handleToggleBookSeat = (busId: string) => {
    setBookedBuses((prev) => {
      const isBooked = prev.includes(busId);
      if (isBooked) {
        // Cancel seat
        setBuses((currBuses) =>
          currBuses.map((b) =>
            b.id === busId ? { ...b, availableSeats: Math.min(b.totalSeats, b.availableSeats + 1) } : b
          )
        );
        return prev.filter((id) => id !== busId);
      } else {
        // Reserve seat
        setBuses((currBuses) =>
          currBuses.map((b) =>
            b.id === busId && b.availableSeats > 0
              ? { ...b, availableSeats: b.availableSeats - 1 }
              : b
          )
        );
        return [...prev, busId];
      }
    });
  };

  // Handle seat picking from seat layout map modal
  const handlePickSeatNumber = (busId: string, _seatNumber: number) => {
    if (!bookedBuses.includes(busId)) {
      handleToggleBookSeat(busId);
    }
  };

  const handleNavClick = (tab: 'home' | 'find' | 'routes' | 'dashboard' | 'about') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* College Top Alert / Information Header */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center border-b border-slate-800">
        <span className="font-semibold text-blue-400">Campus Transit Advisory:</span>{' '}
        Evening departure scheduled at 04:45 PM from Gate 2 bays. Verify your destination before boarding.
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavClick}
        onQuickFindClick={() => {
          setActiveTab('home');
          const input = document.getElementById('destination-input');
          if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {activeTab === 'home' || activeTab === 'find' ? (
          <Home
            buses={buses}
            bookedBuses={bookedBuses}
            onViewRoute={handleViewRoute}
            onViewSeatMap={handleViewSeatMap}
            onToggleBookSeat={handleToggleBookSeat}
            onNavigateTab={handleNavClick}
            initialQuery={searchedDestination}
            onUpdateSearchedTerm={setSearchedDestination}
          />
        ) : activeTab === 'routes' ? (
          <RoutesPage
            buses={buses}
            bookedBuses={bookedBuses}
            onViewRoute={handleViewRoute}
            onViewSeatMap={handleViewSeatMap}
            onToggleBookSeat={handleToggleBookSeat}
          />
        ) : activeTab === 'dashboard' ? (
          <DashboardPage
            buses={buses}
            onViewRoute={handleViewRoute}
            onViewSeatMap={handleViewSeatMap}
          />
        ) : (
          <AboutPage onNavigateTab={handleNavClick} />
        )}
      </main>

      {/* Modals */}
      <RouteModal
        bus={selectedRouteBus}
        searchedDestination={searchedDestination}
        onClose={() => setSelectedRouteBus(null)}
      />

      <SeatLayoutModal
        bus={selectedSeatBus}
        onClose={() => setSelectedSeatBus(null)}
        onBookSeat={handlePickSeatNumber}
      />

      {/* Footer */}
      <Footer onNavClick={handleNavClick} />
    </div>
  );
}
