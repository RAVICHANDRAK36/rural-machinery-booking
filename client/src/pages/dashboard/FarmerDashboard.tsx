import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { AdvancedBookingCalendar } from '../../components/calendar/AdvancedBookingCalendar';
import { Tractor, Search, Filter, Calendar, MapPin, Star, Clock, CheckCircle2, AlertCircle, X, ArrowRight, PhoneCall, Heart, Info, UserCheck } from 'lucide-react';

interface FarmerDashboardProps {
  onNavigate?: (route: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [machines, setMachines] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchVillage, setSearchVillage] = useState<string>('');

  // Booking Modal State
  const [bookingMachine, setBookingMachine] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-15');
  const [selectedSlot, setSelectedSlot] = useState<string>('08:00 AM');
  const [acres, setAcres] = useState<number>(5);
  const [workType, setWorkType] = useState<string>('Harvesting & Threshing');
  const [notes, setNotes] = useState<string>('Near lake road field. Need urgent work before rain.');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Machine Details Modal State
  const [detailsMachine, setDetailsMachine] = useState<any>(null);

  useEffect(() => {
    fetchMachines();
    fetchBookings();
  }, [selectedType, searchVillage]);

  const fetchMachines = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'ALL') params.append('type', selectedType);
      if (searchVillage) params.append('village', searchVillage);

      const res = await fetch(`/api/machines?${params.toString()}`);
      if (res.ok) setMachines(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setBookings(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const getFallbackImage = (type: string) => {
    const tLower = type ? type.toLowerCase() : 'tractor';
    if (tLower.includes('spray')) return '/machines/sprayer-default.jpg';
    if (tLower.includes('harvest')) return '/machines/harvester-default.jpg';
    if (tLower.includes('rotav')) return '/machines/rotavator-default.jpg';
    if (tLower.includes('seed')) return '/machines/seeddrill-default.jpg';
    return '/machines/tractor-default.jpg';
  };

  const handleBookNow = (machine: any) => {
    setBookingMachine(machine);
    if (machine.type === 'HARVESTER') setWorkType(language === 'kn' ? 'ಭತ್ತ ಕಟಾವು ಮತ್ತು ಒಕ್ಕಣೆ' : 'Harvesting & Threshing');
    else if (machine.type === 'TRACTOR') setWorkType(language === 'kn' ? 'ಆಳವಾದ ಉಳುಮೆ ಮತ್ತು ಭೂ ಸಿದ್ಧತೆ' : 'Deep Ploughing & Soil Preparation');
    else if (machine.type === 'ROTAVATOR') setWorkType(language === 'kn' ? 'ರೋಟವೇಟಿಂಗ್ ಮತ್ತು ಮಣ್ಣು ಹದಗೊಳಿಸುವಿಕೆ' : 'Rotavating & Soil Refinement');
    else if (machine.type === 'SPRAYER') setWorkType(language === 'kn' ? 'ಬೆಳೆ ಕೀಟನಾಶಕ ಸಿಂಪರಣೆ' : 'Crop Pesticide Spraying');
    else if (machine.type === 'SEED_DRILL') setWorkType(language === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಬೀಜ ಬಿತ್ತನೆ' : 'Automatic Seed Sowing');
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingMachine) return;

    // Client-side Maintenance check
    const dateObj = new Date(selectedDate);
    if (bookingMachine.maintenance_enabled && dateObj.getDay() === bookingMachine.maintenance_day) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      showToast(`Selected date is a Maintenance Day (${dayNames[bookingMachine.maintenance_day]}). Please pick another date.`, 'error');
      return;
    }

    setSubmittingBooking(true);
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          machine_id: bookingMachine.id,
          booking_date: selectedDate,
          time_slot: selectedSlot,
          acres,
          work_type: workType,
          notes
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Booking ${data.booking_number} reserved successfully!`, 'success');
        setBookingMachine(null);
        fetchBookings();
      } else {
        showToast(data.error || 'Failed to confirm booking.', 'error');
      }
    } catch (e) {
      showToast('Network error during booking.', 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (res.ok) {
        showToast('Booking request cancelled.', 'info');
        fetchBookings();
      }
    } catch (e) {
      showToast('Failed to cancel booking.', 'error');
    }
  };

  const handleToggleFavorite = (machineId: number) => {
    if (favorites.includes(machineId)) {
      setFavorites(favorites.filter((id) => id !== machineId));
      showToast('Removed from favorites.', 'info');
    } else {
      setFavorites([...favorites, machineId]);
      showToast('Saved to your favorites!', 'success');
    }
  };

  const handleCallOwner = (phone: string, ownerName: string) => {
    showToast(`Connecting call to owner ${ownerName} (${phone})...`, 'info');
    window.location.href = `tel:${phone}`;
  };

  const filterTypes = [
    { key: 'ALL', label: t('farmer.filters.all') },
    { key: 'TRACTOR', label: t('farmer.filters.tractor') },
    { key: 'HARVESTER', label: t('farmer.filters.harvester') },
    { key: 'ROTAVATOR', label: t('farmer.filters.rotavator') },
    { key: 'SEED_DRILL', label: t('farmer.filters.seed_drill') },
    { key: 'SPRAYER', label: t('farmer.filters.sprayer') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t('farmer.portal_title')}</span>
            <h1 className="text-3xl font-black text-white mt-1">{t('farmer.welcome')}, {user?.name || 'Farmer'} 👋</h1>
            <p className="text-xs text-slate-400">
              {t('auth.village')}: {user?.village} • {t('auth.taluk')}: {user?.taluk || user?.village} • {t('auth.district')}: {user?.district}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate && onNavigate('/dashboard/farmer/profile')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('nav.edit_profile')}</span>
            </button>
            
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl text-xs text-emerald-300 font-bold hidden sm:block">
              🌱 Kharif / Rabi 2026
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Equipment Type Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterTypes.map((tItem) => (
              <button
                key={tItem.key}
                onClick={() => setSelectedType(tItem.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  selectedType === tItem.key
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>

          {/* Location Search Input */}
          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchVillage}
              onChange={(e) => setSearchVillage(e.target.value)}
              placeholder={t('farmer.filters.search_placeholder')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* Available Machinery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">{t('farmer.available_title')}</h2>
          <span className="text-xs text-slate-400">{machines.length} {t('farmer.verified_units')}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Loading machinery catalog...</div>
        ) : machines.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-xs font-bold text-slate-400 space-y-2">
            <Tractor className="w-10 h-10 text-slate-600 mx-auto" />
            <p>No equipment matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((m) => {
              const isFav = favorites.includes(m.id);
              const fallback = getFallbackImage(m.type);

              return (
                <div
                  key={m.id}
                  className="glass-card rounded-3xl border border-white/10 hover:border-emerald-500/50 shadow-xl overflow-hidden flex flex-col justify-between group transition-all duration-300"
                >
                  
                  {/* Image with fallback onError */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={m.image_url || fallback}
                      alt={m.name}
                      onError={(e) => { e.currentTarget.src = fallback; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-white/10">
                      {m.type}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleFavorite(m.id)}
                      className="absolute top-3 right-3 p-2 bg-slate-950/70 backdrop-blur-md rounded-full text-white hover:text-rose-400 transition"
                      title={t('farmer.save_favorite')}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{m.village} (~2.5 km)</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>{m.rating}</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition line-clamp-1">
                        {m.name}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>{language === 'kn' ? 'ಮಾಲೀಕರು:' : 'Owner:'} <strong className="text-slate-200">{m.owner_name}</strong></span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                          {m.available ? (language === 'kn' ? '🟢 ಲಭ್ಯವಿದೆ' : '🟢 Available') : (language === 'kn' ? '🔴 ಬಳಕೆಯಲ್ಲಿದೆ' : '🔴 In Use')}
                        </span>
                      </div>

                      {/* Pricing Pills */}
                      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{t('farmer.rate_per_acre')}</span>
                          <span className="text-sm font-black text-amber-300">₹{m.price_per_acre.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{t('farmer.rate_per_hour')}</span>
                          <span className="text-sm font-black text-slate-200">₹{m.price_per_hour.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Working Card Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleBookNow(m)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 text-xs cursor-pointer hover:scale-[1.02]"
                      >
                        <span>{t('farmer.book_now')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => setDetailsMachine(m)}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2 rounded-xl border border-white/10 flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>{t('farmer.view_details')}</span>
                        </button>
                        <button
                          onClick={() => handleCallOwner(m.owner_phone || '9876543211', m.owner_name)}
                          className="bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold py-2 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('farmer.call_owner')}</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Farmer's Bookings History */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="text-xl font-black text-white">{t('farmer.my_bookings_title')}</h2>

        {bookings.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center text-xs text-slate-400">
            No active bookings. Choose a machine above to book.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-card p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-900 text-slate-300 font-black px-2.5 py-0.5 rounded-lg border border-white/10 text-[10px]">
                      {b.booking_number}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      b.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : b.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : b.status === 'COMPLETED'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{b.machine_name}</h4>
                  <p className="text-slate-400">
                    {t('calendar.land_area')}: <strong>{b.acres} Acres</strong> • {language === 'kn' ? 'ಸ್ಲಾಟ್' : 'Slot'}: <strong>{b.time_slot}</strong> • {language === 'kn' ? 'ದಿನಾಂಕ' : 'Date'}: <strong>{b.booking_date}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">{language === 'kn' ? 'ಮಾಲೀಕರು' : 'Owner'}: {b.owner_name} ({b.owner_phone}) • Reg: {b.registration_number}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('farmer.total_cost')}</span>
                    <span className="text-base font-black text-amber-300">₹{b.total_cost.toLocaleString()}</span>
                  </div>

                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold px-3 py-1.5 rounded-xl border border-rose-500/30 transition cursor-pointer"
                    >
                      {t('farmer.cancel_request')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Professional Booking Modal with AdvancedBookingCalendar */}
      {bookingMachine && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-white/10 space-y-5 text-xs my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">{t('calendar.title')}</span>
                <h3 className="text-lg font-black text-white mt-0.5">{bookingMachine.name}</h3>
                <p className="text-slate-400 text-[11px]">
                  {bookingMachine.owner_name} • ₹{bookingMachine.price_per_acre}/{language === 'kn' ? 'ಎಕರೆ' : 'acre'}
                </p>
              </div>
              <button
                onClick={() => setBookingMachine(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              {/* Professional Real Calendar Component */}
              <AdvancedBookingCalendar
                maintenanceDay={bookingMachine.maintenance_day}
                maintenanceEnabled={bookingMachine.maintenance_enabled === 1}
                bookedSlots={bookingMachine.booked_slots || []}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelectDate={(d) => setSelectedDate(d)}
                onSelectSlot={(s) => setSelectedSlot(s)}
              />

              {/* Land Acres Input */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('calendar.land_area')}</label>
                <input
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Live Cost Summary Box */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-300">{t('calendar.total_calc')}</span>
                  <span className="text-base text-amber-300 font-black">
                    ₹{(acres * bookingMachine.price_per_acre).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {acres} acres × ₹{bookingMachine.price_per_acre}/acre on {selectedDate} ({selectedSlot})
                </p>
              </div>

              {/* Work Type */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('calendar.work_type')}</label>
                <input
                  type="text"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-semibold"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('calendar.notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs font-semibold"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingMachine(null)}
                  className="w-1/2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl border border-white/10 cursor-pointer"
                >
                  {t('calendar.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="w-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-black py-3 rounded-xl shadow-lg transition cursor-pointer"
                >
                  {submittingBooking ? 'Reserving...' : t('calendar.confirm_booking')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Machine Details Modal */}
      {detailsMachine && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">{detailsMachine.name}</h3>
              <button onClick={() => setDetailsMachine(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-44 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={detailsMachine.image_url || getFallbackImage(detailsMachine.type)}
                alt={detailsMachine.name}
                onError={(e) => { e.currentTarget.src = getFallbackImage(detailsMachine.type); }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-slate-300">Type: <strong className="text-white">{detailsMachine.type}</strong></p>
              <p className="text-slate-300">Registration Number: <strong className="text-emerald-400">{detailsMachine.registration_number}</strong></p>
              <p className="text-slate-300">Owner: <strong className="text-white">{detailsMachine.owner_name}</strong> ({detailsMachine.owner_phone})</p>
              <p className="text-slate-300">Village: <strong className="text-white">{detailsMachine.village}</strong></p>
              <p className="text-slate-300">Rating: <strong className="text-amber-300">⭐ {detailsMachine.rating} / 5.0</strong></p>
              <p className="text-slate-300">
                Weekly Maintenance Day: <strong className="text-rose-400">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][detailsMachine.maintenance_day]}</strong>
              </p>
            </div>

            <button
              onClick={() => {
                setDetailsMachine(null);
                handleBookNow(detailsMachine);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl shadow-md transition mt-2 cursor-pointer"
            >
              {t('farmer.book_now')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
