import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { LocationSearch, LocationData } from '../../components/location/LocationSearch';
import { Tractor, PlusCircle, CheckCircle, XCircle, Trash2, Edit3, DollarSign, Calendar, Users, Eye, X, Wrench, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface OwnerDashboardProps {
  onNavigate?: (route: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [machines, setMachines] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add Machine Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('TRACTOR');
  const [registrationNumber, setRegistrationNumber] = useState('KA-53-T-8822');
  const [pricePerAcre, setPricePerAcre] = useState(1200);
  const [pricePerHour, setPricePerHour] = useState(1000);
  const [village, setVillage] = useState(user?.village || 'Hoskote');
  const [taluk, setTaluk] = useState(user?.taluk || 'Hoskote');
  const [district, setDistrict] = useState(user?.district || 'Bengaluru Rural');
  const [latitude, setLatitude] = useState<number | undefined>(13.0755);
  const [longitude, setLongitude] = useState<number | undefined>(77.8015);
  const [maintenanceDay, setMaintenanceDay] = useState(0); // Sunday
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(true);

  // Edit Machine Modal State
  const [editingMachine, setEditingMachine] = useState<any>(null);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const token = localStorage.getItem('rmb_token');
      const [resM, resB, resS] = await Promise.all([
        fetch('/api/machines'),
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (resM.ok) {
        const allM = await resM.json();
        setMachines(allM);
      }
      if (resB.ok) setBookings(await resB.json());
      if (resS.ok) setStats(await resS.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  const handleLocationSelect = (loc: LocationData) => {
    setVillage(loc.village);
    setTaluk(loc.taluk);
    setDistrict(loc.district);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
  };

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch('/api/machines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          type,
          registration_number: registrationNumber,
          price_per_acre: pricePerAcre,
          price_per_hour: pricePerHour,
          village,
          taluk,
          district,
          latitude,
          longitude,
          maintenance_day: maintenanceDay,
          maintenance_enabled: maintenanceEnabled
        })
      });

      if (res.ok) {
        showToast('Machinery listed successfully!', 'success');
        setShowAddModal(false);
        setName('');
        fetchOwnerData();
      } else {
        showToast('Failed to add machine.', 'error');
      }
    } catch (e) {
      showToast('Network error.', 'error');
    }
  };

  const handleUpdateMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMachine) return;
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch(`/api/machines/${editingMachine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingMachine)
      });
      if (res.ok) {
        showToast('Machine details updated.', 'success');
        setEditingMachine(null);
        fetchOwnerData();
      }
    } catch (e) {
      showToast('Failed to update machine.', 'error');
    }
  };

  const handleDeleteMachine = async (id: number) => {
    if (!confirm('Are you sure you want to delete this machine?')) return;
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch(`/api/machines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Machinery deleted.', 'info');
        fetchOwnerData();
      }
    } catch (e) {
      showToast('Failed to delete machine.', 'error');
    }
  };

  const handleToggleAvailability = async (machine: any) => {
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch(`/api/machines/${machine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ available: !machine.available })
      });
      if (res.ok) {
        showToast(`Machine status updated to ${!machine.available ? 'Available' : 'Busy'}`, 'success');
        fetchOwnerData();
      }
    } catch (e) {}
  };

  const handleUpdateBookingStatus = async (bookingId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Booking request ${status.toLowerCase()} successfully!`, status === 'APPROVED' ? 'success' : 'info');
        fetchOwnerData();
      }
    } catch (e) {
      showToast('Failed to update booking status.', 'error');
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === 'PENDING');
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesKn = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];
  const dayNames = language === 'kn' ? dayNamesKn : dayNamesEn;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t('owner.portal_title')}</span>
          <h1 className="text-3xl font-black text-white mt-1">{user?.business_name || user?.name || 'Owner'} 👋</h1>
          <p className="text-xs text-slate-400">{user?.phone} • {t('auth.village')}: {user?.village} • {t('auth.district')}: {user?.district}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate('/dashboard/owner/profile')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>{t('nav.edit_profile')}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-xl transition flex items-center space-x-2 cursor-pointer hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{t('owner.add_equipment')}</span>
          </button>
        </div>
      </div>

      {/* Earnings Breakdown KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('owner.today_earnings')}</span>
          <div className="text-2xl font-black text-emerald-400">₹{(stats?.earningsToday || 12000).toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">From 2 completed jobs</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('owner.this_week')}</span>
          <div className="text-2xl font-black text-amber-400">₹{(stats?.earningsWeek || 38500).toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">6 active jobs</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('owner.this_month')}</span>
          <div className="text-2xl font-black text-white">₹{(stats?.earningsMonth || 64000).toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">August 2026</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{t('owner.pending_requests')}</span>
          <div className="text-2xl font-black text-amber-300">{pendingRequests.length}</div>
          <p className="text-[10px] text-slate-500">Awaiting your approval</p>
        </div>
      </div>

      {/* Incoming Requests & Approvals Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">{t('owner.incoming_requests_title')}</h2>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30">
            {pendingRequests.length} {language === 'kn' ? 'ಬಾಕಿ ಕ್ರಮಗಳು' : 'Pending Actions'}
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center text-xs text-slate-400">
            No pending booking requests right now.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="glass-card p-5 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-lg text-[10px]">
                      {b.booking_number}
                    </span>
                    <span className="font-extrabold text-white text-sm">{b.machine_name}</span>
                  </div>
                  <p className="text-slate-300">
                    Farmer: <strong>{b.farmer_name}</strong> ({b.farmer_phone}) • Village: {b.farmer_village}
                  </p>
                  <p className="text-slate-400">
                    Area: <strong>{b.acres} Acres</strong> • Time Slot: <strong>{b.time_slot}</strong> • Date: <strong>{b.booking_date}</strong>
                  </p>
                  {b.notes && <p className="text-[11px] text-amber-200/80 italic">"{b.notes}"</p>}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Earnings</span>
                    <span className="text-base font-black text-amber-300">₹{b.total_cost.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'APPROVED')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2 rounded-xl transition flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('owner.accept')}</span>
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold px-3 py-2 rounded-xl border border-rose-500/30 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t('owner.reject')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Equipment Fleet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">{t('owner.my_fleet_title')}</h2>
          <span className="text-xs text-slate-400">{machines.length} Total Units</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((m) => {
            const fallback = getFallbackImage(m.type);

            return (
              <div key={m.id} className="glass-card rounded-3xl border border-white/10 p-5 space-y-4">
                <div className="h-40 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={m.image_url || fallback}
                    alt={m.name}
                    onError={(e) => { e.currentTarget.src = fallback; }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-400 uppercase">{m.type}</span>
                    <button
                      onClick={() => handleToggleAvailability(m)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer ${
                        m.available ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.available ? t('owner.available') : t('owner.busy')}
                    </button>
                  </div>
                  <h3 className="font-extrabold text-sm text-white mt-1 line-clamp-1">{m.name}</h3>
                  <p className="text-xs text-slate-400">Reg: {m.registration_number} • {m.village}</p>
                  
                  {/* Maintenance Day Badge */}
                  <div className="mt-2 text-[11px] bg-slate-900 px-2.5 py-1 rounded-xl text-slate-300 flex items-center space-x-1.5 border border-white/5">
                    <Wrench className="w-3 h-3 text-amber-400" />
                    <span>{t('owner.maintenance_day_label')}: {dayNames[m.maintenance_day || 0]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">{t('farmer.rate_per_acre')}</span>
                    <span className="font-bold text-amber-300">₹{m.price_per_acre}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">{t('farmer.rate_per_hour')}</span>
                    <span className="font-bold text-slate-200">₹{m.price_per_hour}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => setEditingMachine(m)}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t('owner.edit')}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMachine(m.id)}
                    className="w-1/2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('owner.delete')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-extrabold text-base text-white">Monthly Revenue & Bookings Trend</h3>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val) => [`₹${val}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Machine Modal with LocationSearch */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/10 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">{t('owner.add_equipment')}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Equipment Name & Model</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swaraj 744 FE Tractor / Fieldking Sprayer"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Equipment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="TRACTOR">Tractor</option>
                    <option value="HARVESTER">Harvester</option>
                    <option value="ROTAVATOR">Rotavator</option>
                    <option value="SEED_DRILL">Seed Drill</option>
                    <option value="SPRAYER">Sprayer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Registration No.</label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="KA-53-M-4821"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              {/* Location Search for Machinery Station */}
              <LocationSearch
                initialLocation={{ village, taluk, district, latitude, longitude }}
                onLocationSelect={handleLocationSelect}
                placeholder="Station / garage village or area..."
                label="Machinery Hub Location (Google Maps Autocomplete)"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('farmer.rate_per_acre')} (₹)</label>
                  <input
                    type="number"
                    required
                    value={pricePerAcre}
                    onChange={(e) => setPricePerAcre(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('farmer.rate_per_hour')} (₹)</label>
                  <input
                    type="number"
                    required
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('owner.maintenance_day_label')}</label>
                <select
                  value={maintenanceDay}
                  onChange={(e) => setMaintenanceDay(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value={0}>Sunday (ಭಾನುವಾರ)</option>
                  <option value={1}>Monday (ಸೋಮವಾರ)</option>
                  <option value={2}>Tuesday (ಮಂಗಳವಾರ)</option>
                  <option value={3}>Wednesday (ಬುಧವಾರ)</option>
                  <option value={4}>Thursday (ಗುರುವಾರ)</option>
                  <option value={5}>Friday (ಶುಕ್ರವಾರ)</option>
                  <option value={6}>Saturday (ಶನಿವಾರ)</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-slate-900 text-slate-300 font-bold py-2.5 rounded-xl border border-white/10"
                >
                  {t('calendar.cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black py-2.5 rounded-xl shadow-lg cursor-pointer"
                >
                  {t('owner.add_equipment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Machine Modal */}
      {editingMachine && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10 space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Edit Machinery Details</h3>
            <form onSubmit={handleUpdateMachine} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Machine Name</label>
                <input
                  type="text"
                  value={editingMachine.name}
                  onChange={(e) => setEditingMachine({ ...editingMachine, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('farmer.rate_per_acre')} (₹)</label>
                  <input
                    type="number"
                    value={editingMachine.price_per_acre}
                    onChange={(e) => setEditingMachine({ ...editingMachine, price_per_acre: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{t('owner.maintenance_day_label')}</label>
                  <select
                    value={editingMachine.maintenance_day || 0}
                    onChange={(e) => setEditingMachine({ ...editingMachine, maintenance_day: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value={0}>Sunday (ಭಾನುವಾರ)</option>
                    <option value={1}>Monday (ಸೋಮವಾರ)</option>
                    <option value={2}>Tuesday (ಮಂಗಳವಾರ)</option>
                    <option value={3}>Wednesday (ಬುಧವಾರ)</option>
                    <option value={4}>Thursday (ಗುರುವಾರ)</option>
                    <option value={5}>Friday (ಶುಕ್ರವಾರ)</option>
                    <option value={6}>Saturday (ಶನಿವಾರ)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMachine(null)}
                  className="w-1/2 bg-slate-900 text-slate-300 font-bold py-2.5 rounded-xl border border-white/10"
                >
                  {t('calendar.cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
